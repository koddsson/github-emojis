if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

var findEmoji = function(text, callback) {
    $.getJSON(chrome.extension.getURL('emojis.json'), function(emojis) {
        var results = _(emojis)
          .chain()
          .pairs()
          .filter(function(emoji) {
              // Search the list of descriptions for the given string
              var in_list = _(emoji[1].keywords).reduce(function (last, desc) {
                return last || desc.startsWith(text);
              }, false);
              if (emoji[0].startsWith(text) || in_list) {
                 return emoji[0];
              }
          })
          .map(_.first)
          .value();
        callback(results);
    });
};


$(document).ready(function() {
    // Oh god this is bad.
    setInterval(function() {
        $('textarea.comment-form-textarea').textcomplete([
            {
                match: /(^|\s)\$(\w*)$/,
                replace: function (value) { return '$1:' + value + ':'; },
                template: function (value) {
                    var imgURL = 'https://github.global.ssl.fastly.net/images/icons/emoji/' + value + '.png?v5';
                    return '<img style="height: 20px;" src="' + imgURL + '"></img>' + value;
                },
                search:    function (term, callback) {
                    findEmoji(term, callback);
                },
                maxCount: 5
            }
        ]);
    }, 1000);
});
