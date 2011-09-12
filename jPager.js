/*
 * Use It and don't complain
 * THX to Sinnerschrader
 */
(function($) { 
    var Pager = function($base, option) { 
      var self = this;
      this.$ul;
      $base.bind("jRollover.ready", function(e, item, items) {
        var my = $(this);
        self.$ul = $('<ul class="pager"></ul>')
        for(var i = 0, l = items.length; i < l; ++i) {
          var $li = $('<li></li>');
          $li.data('item', items[i]);
          items[i].data('page', $li);
          if (item === items[i]) {
            $li.addClass('active');
          }
          self.$ul.append($li);
        }
        my.append(self.$ul);
        self.$ul.find('li').click(function() {
          $base.trigger("jRollover.goto", $(this).data('item'));
        })
      });

      $base.bind("jRollover.nowVisible", function(e, item) {
             self.$ul.find('li.active').removeClass('active');
             $(item).data('page').addClass('active');
      })
    }

    $.fn.jPager = function(option) {
       $(this).each(function() {
         new Pager($(this), option)
       })
       return this;
    }
})(jQuery);
