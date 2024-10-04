/*
 * Copyright (c) 2019.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const admin = require("firebase-admin");
const pool = require("../bin/DBconfig");
const serviceAccount = require(`../firebase/aliva-c831b-firebase-adminsdk-66zup-b1aaeea7d0.json`);
const moment = require('moment');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aliva-c831b.firebaseio.com"
});

async function notifications(data) {
  try {

    let notification = null;
    const buildNotification = async function (notification) {
      const date = moment().format('YYYY-MM-DD HH:mm:ssZ').toString();
      const payload = {
        notification: {
          title: notification.title.toString(),
          body: notification.message.toString(),
        },
        data: {
          order: notification.order.toString(),
          date: date,
          created_at: date,
          notifications_type: notification.type.toString(),
        },
      };
      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
      };
      return {
        payload,
        options
      }
    }
    switch (data.title) {
      case 1:
        data.admin = 'Se ha generado una nueva orden';
        data.message = `La orden  #${data.order} ha sido creada`
        notification = await buildNotification({
          title: data.admin,
          message: data.message,
          order: data.order,
          type: 1
        })
        await sendNotifications(await tokensNotificationsAdmin(), notification.payload, notification.options)
        break;
      case 2:
        data.store = 'Se ha generado una nueva orden';
        data.message = `La orden  #${data.order} ha sido creada`
        notification = await buildNotification({
          title: data.store,
          message: data.message,
          order: data.order,
          type: 1
        })
        await sendNotifications(await tokensNotificationsAdminStore(data.order), notification.payload, notification.options)
        data.client = `El pago de la orden #${data.order} ha sido confirmado`
        notification = await buildNotification({
          title: data.client,
          message: '',
          order: data.order,
          type: 1
        })

        await sendNotifications(await tokensNotificationsUsers(data.order), notification.payload, notification.options)
        break;
      case 3:
        data.store = 'Ali va en camino a recoger el pedido ';
        notification = await buildNotification({
          title: data.store,
          message: '',
          order: data.order,
          type: 1
        })
        await sendNotifications(await tokensNotificationsAdminStore(data.order), notification.payload, notification.options)
        data.client = 'Ali va en camino a recoger el pedido ';
        notification = await buildNotification({
          title: data.client,
          message: '',
          order: data.order,
          type: 1
        })
        await sendNotifications(await tokensNotificationsUsers(data.order), notification.payload, notification.options)
        break;
      case 4:
        data.admin = `El pedido #${data.order} de la tienda ${data.storeName} esta listo`;
        notification = await buildNotification({
          title: data.admin,
          message: '',
          order: data.order,
          type: 'ORDEN'
        })
        await sendNotifications(await tokensNotificationsAdmin(), notification.payload, notification.options)
        break;
      case 5:
        data.title = `La orden #${data.order} va en camino`;
        notification = await buildNotification({
          title: data.title,
          message: '',
          order: data.order,
          type: 1
        })
        await sendNotifications(await tokensNotificationsUsers(data.order), notification.payload, notification.options)
        break;
      case 6:
        data.title = `Ali entrego tu orden #${data.order}`;
        notification = await buildNotification({
          title: data.title,
          message: '',
          order: data.order,
          type: 1
        })
        await sendNotifications(await tokensNotificationsUsers(data.order), notification.payload, notification.options)
        break;
    }


  } catch (e) {
    console.log(e)
  }
}

async function getDispositive(data) {
  switch (data.type) {
    case 3:
      return await pool.query(`SELECT *
                               from notifications
                                      INNER JOIN users
                                                 ON notifications.usersId = users.usersId
                               where users.userLevelsId = ?
                                 AND users.userNotifications = true`, [data.type]);
    case 4:
      break;
  }
  return await pool.query(`SELECT *
                           from notifications
                                  INNER JOIN users
                                             ON notifications.usersId = users.usersId
                           where usersId = ?
                             AND users.userNotifications = true`, [data.type]);
}

async function tokensNotificationsAdmin() {
  return await pool.query(`SELECT notifications.firebaseToken,
                                  notifications.dispositiveTypeId
                           from notifications
                                  inner join users u on notifications.usersId = u.usersId
                           where u.userLevelsId = 1
                             and u.userNotifications = true`);
}

async function tokensNotificationsAdminStore(order) {
  return await pool.query(`SELECT notifications.firebaseToken,
                                  notifications.dispositiveTypeId
                           FROM notifications
                                  INNER JOIN users
                                             ON notifications.usersId = users.usersId
                                  INNER JOIN storeproperty
                                             ON storeproperty.usersId = users.usersId
                                  INNER JOIN store
                                             ON storeproperty.storeId = store.storeId
                                  INNER JOIN itemcategories
                                             ON itemcategories.storeId = store.storeId
                                  INNER JOIN items
                                             ON items.itemCategoriesId = itemcategories.itemCategoriesId
                                  INNER JOIN ordersdetails
                                             ON ordersdetails.itemsId = items.itemsId
                           where users.userNotifications = true
                             and ordersdetails.ordersId = ?
                             and notifications.appType = 2`, [order])

}

async function tokensNotificationsUsers(order) {
  const tokens = await pool.query(`SELECT notifications.firebaseToken,
                                          notifications.dispositiveTypeId
                                   FROM notifications
                                          INNER JOIN users
                                                     ON notifications.usersId = users.usersId
                                          INNER JOIN orders
                                                     ON orders.clientId = users.usersId
                                   where users.userNotifications = true
                                     and orders.ordersId = ?
                                     and notifications.appType = 1`, [order])
  return tokens;
}

async function sendNotifications(dispositive, payload, options) {
  const notification = Object.assign({}, payload)
  for (let i = 0; i < dispositive.length; i++) {
    if (dispositive[i].hasOwnProperty('dispositiveTypeId')) {
      if (dispositive[i].dispositiveTypeId === 1) {
        delete payload.notification
        payload.data.title = notification.notification.title
        payload.data.message = notification.notification.body
      } else {
        payload = Object.assign({}, notification)
      }
    } else {
      payload = Object.assign({}, notification)
    }
    let a = await admin.messaging().sendToDevice(dispositive[i].firebaseToken, payload, options);
    console.log({payload, options, a})
    if (a.results[0].error) {
      console.log(a.results[0].error)
    }
  }
}

async function validateOrder(orderID, statusChange, storeName = '') {
  let orderStatus = await pool.query(`SELECT *
                                      from orders
                                      where ordersId = ?`, [orderID]);
  if (statusChange === 4) {
    orderStatus = await pool.query(`SELECT orders.*,
                                           s.storeName
                                    from orders
                                           inner join ordersdetails
                                                      on orders.ordersId = ordersdetails.ordersId
                                           inner join items
                                                      on ordersdetails.itemsId = items.itemsId
                                           inner join itemcategories
                                                      on items.itemCategoriesId = itemcategories.itemCategoriesId
                                           inner join store s on itemcategories.storeId = s.storeId
                                    where ordersDetailsId = ? `, [orderID])
  }

  if (Number(orderStatus[0].statusId) !== Number(statusChange)) {
    switch (Number(statusChange)) {
      case 1:
        statusChange = 2
        break;
      case 2:
        statusChange = 1
        break;
      case 3:
        statusChange = 2
        break;
      case 4:
        statusChange = 6
        break
      case 5:
        statusChange = 4
        storeName = orderStatus[0].storeName
        break;
      case 6:
        statusChange = 3
        break;
    }
    await notifications({order: orderID, title: statusChange, type: 'ORDEN', storeName})
  }
}

async function adminNotification(data = {title: String, description: String, order: Number, tokens: Array}) {
  try {
    let payload = {
      notification: {
        title: data.title.toString(),
        body: data.description.toString()
      },
      data: {
        order: data.order.toString(),
        date: moment().format('YYYY-MM-DD HH:mm:ssZ').toString(),
        created_at: moment().format('YYYY-MM-DD HH:mm:ssZ').toString(),
        notifications_type: 'ORDEN'
      }
    }
    let options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
    }
    Array.prototype.unique = function (a) {
      return function () {
        return this.filter(a)
      }
    }(function (a, b, c) {
      return c.indexOf(a, b + 1) < 0
    })
    data.tokens = data.tokens.unique()
    const resultado = await admin.messaging().sendToDevice(data.tokens, payload, options)
    console.log(resultado)
    return resultado
  } catch (error) {
    console.log('Error al enviar este token: ', error)
  }
}

function constructMessagge(data = {
  statusId: Number,
  statusName: String,
  statusDescription: String,
  nivel: 1,
  ordersId: Number
}) {
  var mensaje
  // nivel 1 == Administrador
  // nivel 2 == Tienda
  // nivel 3 == Deliver
  // nivel 4 == Cliente
  switch (data.statusId) {
    case 1:
      // En espera
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} está siendo procesada. Por favor revisa si está lista para aprobar.`
      else if (data.nivel == 2) mensaje = `La Orden N° ${data.ordersId} se está gestionando. Prepara los artículos que están en la orden para entregar.`
      else if (data.nivel == 3) mensaje = `La Orden N° ${data.ordersId} está en evaluación. Prepara tu vehículo para salir a comprar la orden.`
      else mensaje = `Tu orden N° ${data.ordersId} está siendo procesada, te notificaremos una vez este lista para pagar.`
      break
    case 2:
      // Asignado
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} fué asignada a un deliver.`
      else if (data.nivel == 2) mensaje = `La Orden N° ${data.ordersId} fué asignada a un deliver. Prepara los artículos para que el deliver los recoja.`
      else if (data.nivel == 3) mensaje = `La Orden N° ${data.ordersId} te fué asignada. Es hora de recoger los ítems de la orden.`
      else mensaje = `Tu orden N°${data.ordersId} ha sido asignada a uno de nuestros repartidores.`
      break
    case 3:
      // Comprando Orden
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} está lista para entregar. Puedes contactar con el deliver para verificar si todo está bien.`
      else if (data.nivel == 2) mensaje = `El Deliver de la Orden N° ${data.ordersId} ya compró en una de tus tiendas.`
      else if (data.nivel == 3) mensaje = `La notificación de la Orden N° ${data.ordersId} está siendo supervisada por aliva. Gracias por confirmar.`
      else mensaje = `Tu orden N°${data.ordersId} está siendo comprada por uno de nuestros repartidores.`
      break
    case 4:
      // En Camino
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} está en camino para entregar.`
      else if (data.nivel == 2) mensaje = null
      else if (data.nivel == 3) mensaje = null
      else mensaje = `Tu orden N°${data.ordersId} ya ha sido entregada, y el repartidor va en camino a tu ubicacion.`
      break
    case 5:
      // Perdido
      if (data.nivel == 1) mensaje = `El deliver de la Orden N° ${data.ordersId} está perdido o no encuentra al comprador final. Contacta con el para ayudarlo.`
      else if (data.nivel == 2) mensaje = null
      else if (data.nivel == 3) mensaje = `Ya enviamos notificación a los administradores de Aliva. En momentos se contactarán contigo`
      else mensaje = `Tu orden N°${data.ordersId} ya ha sido entregada, pero el repartidor no te encontró en tu ubicacion.`
      break
    case 6:
      // Pagado
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} fué pagada. Verifica los datos para continuar con la orden.`
      else if (data.nivel == 2) mensaje = `La Orden N° ${data.ordersId} será asignada a un deliver. Prepara los artículos para que el deliver los recoja.`
      else if (data.nivel == 3) mensaje = null
      else mensaje = `Tu orden N°${data.ordersId} está guardada, te notificaremos una vez esté confirmado el pago.`
      break
    case 7:
      // Pago confirmado
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} fué confirmada. Asigna un deliver para continuar con la orden.`
      else if (data.nivel == 2) mensaje = null
      else if (data.nivel == 3) mensaje = null
      else mensaje = `Tu orden N°${data.ordersId} fué confirmada.`
      break
    case 8:
      // Completado
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} fué completada.`
      else if (data.nivel == 2) mensaje = `La Orden N° ${data.ordersId} fué completada.`
      else if (data.nivel == 3) mensaje = `La Orden N° ${data.ordersId} fué completada.`
      else mensaje = `Tu orden N°${data.ordersId} fue entregada satisfactoriamente, muchas gracias por confiar en Ali.`
      break
    case 9:
      // Cancelado
      if (data.nivel == 1) mensaje = `La Orden N° ${data.ordersId} fué cancelada.`
      else if (data.nivel == 2) mensaje = `La Orden N° ${data.ordersId} fué cancelada.`
      else if (data.nivel == 3) mensaje = `La Orden N° ${data.ordersId} fué cancelada.`
      else mensaje = `Tu orden N°${data.ordersId} fue cancelada, muchas gracias por confiar en Ali.`
      break
    default:
      break
  }
  return mensaje
}

module.exports = {
  notifications,
  adminNotification,
  constructMessagge,
  validateOrder,
  sendNotifications
};
