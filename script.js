if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

var findEmoji = function(text, callback) {
    $.getJSON(chrome.extension.getURL('emojis.json'), function(emojis) {
        var results = _(emojis).chain()
                               .pairs()
                               .filter(function(emoji) {
                                   var in_list = _(emoji[1]).reduce(function (last, desc) {
                                      return last || desc.startsWith(text);
                                   }, false);
                                   if (emoji[0].startsWith(text) || in_list) {
                                       return emoji;
                                   }
                               })
                               .value();
        callback(results);
    });
};

$(document).ready(function() {
    var searchEmojis = false;
    var searchTerm = '';

    $('textarea#new_comment_field').keypress(function(event) {
        if (searchEmojis) {
            searchTerm += String.fromCharCode(event.which);
            console.log(searchTerm);
            findEmoji(searchTerm, function(data) {
                console.log(data);
            });
        }
        if (event.which === 36 ) { // 36 === $
            console.log('Started searching for emojis!');
            searchEmojis = true;
        }
    }).keyup(function (event) {
        // We need the keyup event handler just for catching esc
        if (event.keyCode === 27) {
            searchEmojis = false;
            searchTerm = '';
        }
    });
});
