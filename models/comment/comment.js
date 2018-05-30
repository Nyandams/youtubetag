function Comment(id_comment, pseudo, content, channel_id){
    this.id_comment = id_comment;
    this.pseudo_user= pseudo;
    this.content    = content;
    this.channel_id = channel_id;
};

module.exports = Comment;