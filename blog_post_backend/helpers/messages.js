class MESSAGES {
    INTERNAL_SERVER_ERROR = "internal server error..."
    USER_ADDED = "User added successfully..."
    ALREADY_EXIST = "User already exist..."
    USER_NOT_FOUND = 'User not found please again start the process.'
    INCORRECT_PASS = "Email or password is incorrect..."
    LOGIN_SUCCESS = "User login successfully..."
    POST_ADDED = "Post added successfully..."
    POST_NOT_FOUND = "Post not found..."
    UPDATED_SUCCESS = "Post updated successfully..."
    COMMENT_ADDED = "Comment is added..."
    COMMENT_DELETED = "Comment is deleted..." 
    POST_DELETE = "Post deleted successfully..."
    SAME_PASSWORDS = "Password must be same."
    OLD_NEW_SAME_PASSWORDS = "Old and new password must not be same."
    EMPTY_VALUE = "Value must not be empty."
}

module.exports = new MESSAGES();
