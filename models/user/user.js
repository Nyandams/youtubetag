function User(id_user, pseudo_user, password_user, email_user, is_admin_user, date_inscription_user){
  this.id_user        = id_user;
  this.pseudo_user    = pseudo_user;
  this.password_user  = password_user;
  this.email_user     = email_user;
  this.is_admin_user  = is_admin_user;
  this.date_inscription_user = date_inscription_user;
};

module.exports = User;
