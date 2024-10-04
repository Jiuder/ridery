/*
 *
 *  * Copyright (c) 2019.
 *  * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 *
 */
const generalMessage = 'Por favor, verifique su '
const messagesMap = {
    userExist: 'Su email o DNI ya se Encuentra Registrado',
    userNotExist: 'El Email del Destinatario no se Encuentra Registrado',
    usersDNI: generalMessage + 'ID',
    usersEmail: generalMessage + 'email',
    usersPassword: generalMessage + 'contraseña',
    usersName: generalMessage + 'nombre',
    usersLastName: generalMessage + 'apellido',
    userPhone: generalMessage + 'telefono',
    oldPassword: generalMessage + `contraseña`,
    renovatePassword: 'Ingrese usa contraseña valida',
    transferAmount: 'Ingrese un monto valido',
    destinationMail: 'Ingrese un destinatario valido',
    insufficientBalance: 'Su Saldo es Insuficiente',
    terms: 'Por favor, verifique los termminos y condiciones de Saldo',
    token: 'Lo sentimos no hemos podido verificar su identidad',
    userActive: `Este usuario aun no ha sido aprobado por Saldo`,
    invalidTabID: `El tipo de ordenes que ha seleccionado no existe`,
    firebaseToken: 'Necesita registrar su dispositivo en Firebase',
    dispositive: 'Por favor, debe enviar el ID de su dispositivo',
    usersId: 'Lo sentimos no conseguimos su usuario',
    dispositiveTypeId: 'Asegurese de enviar el tipo de su dispositivo',
    completeOffer: 'Lo lamentamos, aun no puede marcar como completado este pedido',
    app: 'La aplicación seleccionada no corresponde a lo que desea hacer',
    gateways: 'No hemos podido establecer conexión con el servidor de pago, por favor intenta mas tarde',
    URL: 'URL invalida',
    apiVersion: 'Lo sentimos, no hemos podido obtener la version de su aplicación, por favor comuniquese con soporte tecnico',
    couponError: `Lo sentimos, el cupon que ha colocado no puede ser usado en esta orden`,
    userNotActive: 'El Usuario Fue Desactivado por un Administrador',
    usersNotLogin: 'Inicie Sesión',
    500: `Ha ocurrido un error, por favor intente mas tarde`
};
module.exports = {messagesMap}
