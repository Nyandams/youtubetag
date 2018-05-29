function Comment(id_comment, id_user, content, channel_id){
    this.id_comment = id_comment;
    this.id_user    = id_user;
    this.content    = content;
    this.channel_id = channel_id;
};

module.exports = Comment;