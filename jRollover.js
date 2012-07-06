/*
 * Use It and don't complain
 * THX to Sinnerschrader
 */
(function($) { 

  var Rollover = function(node, option) {
    this.base = node
    this.option = {}
  	var tmpOption = option || {}
  	for(var i in tmpOption) {
  		this.option[i] = tmpOption[i]
  	}
    this.option.$next = this.base.find(this.option.$next) || this.base.find('.next')
    this.option.$prev = this.base.find(this.option.$prev) || this.base.find('.prev')
    this.option.$frame this.option.$frame || this.base.find('.frame')
    
    this.visible_area = this.option.$frame /* visible area */
    this.visible_area.css('position', 'relative')
    this.visible_area.css('overflow-x', 'hidden')
    this.visible_area.css('overflow-y', 'hidden')
    this.list = node.find('ul') 
    this.list.css('position', 'relative')
    this.list.css('float', 'none')
    this.sliding = false

    var self = this
    var _click = function(dir) { return function(e) { 
        e.preventDefault() 
        $(this).blur()
        if (self.sliding) { return }
        self.sliding = true
        dir()
      }
    }
    node.bind("jRollover.stepNext", _click(function() { self.next() }))
    node.bind("jRollover.stepPrev", _click(function() { self.prev() }))
    this.option.$next.click(_click(function() { self.next() }))
    this.option.$prev.click(_click(function() { self.prev() }))
    node.bind("jRollover.goto", function(e, item) { 
      for(var i = self.items.length - 1; i >= 0; --i) {
        if (item === self.items[i][0]) {
          var current = -1*parseInt(self.list.css("margin-left"), 10);
          var goto = parseInt($(item).css('left'), 10);
          var steps = ((goto - current)/self.item_width);
          self.items_first += steps;
          if (self.items_first >= 0) {
            self.items_first = self.items_first % self.items.length;
          } else {
            self.items_first = self.items.length+(self.items_first % self.items.length);
          }
          self.direction(-steps, function() { self.base.trigger("jRollover.nowVisible", [self.nowVisible(), self.items]); });
          break;
        }
      }
    })
    this.setup()
  }

  Rollover.prototype.setup = function() {
      var self = this
      this.jq_items = this.list.find('>li').css('position', 'absolute')
      this.items = []

      this.jq_items.each(function() {
        var my = $(this)
        my.data('pos', self.items.length);
        self.items.push(my);
      })
      this.items_first = 0
      this.item_width = parseInt(this.items[0].css('width'),10)+
                        parseInt(this.items[0].css('margin-right'),10)+
                        parseInt(this.items[0].css('margin-left'),10);
      for(var i = 0, l = this.items.length; i < l; ++i) {
        this.items[i].css('left', (self.item_width * i)+'px');
      }
      this.list.width(this.item_width*this.items.length)
      this.visible_items = parseInt(parseInt(this.visible_area.css('width'),10)/this.item_width, 10)
      if (this.items.length <= this.visible_items) {
        var center_offset = (parseInt(this.visible_area.css('width'),10)-(this.items.length*this.item_width))/2
        this.list.css('margin-left', center_offset + 'px')
        this.option.$next.hide()
        this.option.$prev.hide()
      } else {
    	  this.option.$next.show()
          this.option.$prev.show()
      }
      if (this.items.length == 0) {
    	  this.base.hide()
      } else {
        if (!jQuery.browser.msie6) {
          var direction = "hide"
          var jq_hide = this.base.find('.hide')
          jq_hide.html(jq_hide.data("data-direction", direction))
          var over = function() { 
            jq_hide.trigger('click') 
          }
          jq_hide.click(function(e) {
            var my = $(this)
            var my_offset = my.outerHeight()
            var directions = {
                                hide: { removeClass: "hide", 
                                        addClass: "show", 
                                        direction: (-1*(self.base.outerHeight()-my_offset))+"px" 
                                      },
                                show: { removeClass: "show", 
                                        addClass: "hide", 
                                        direction: "0px" 
                                      }
                             }
            e.preventDefault()
            var current_direction = direction
            var next_direction = (direction == "hide"&&"show")||"hide"
            my.fadeOut('fast', function() {
              my.removeClass(directions[current_direction].removeClass) 
              my.addClass(directions[current_direction].addClass) 
              jq_hide.html(jq_hide.data("data-direction", next_direction))
              my.fadeIn('fast')
            })
            self.base.animate({bottom:directions[direction].direction}, "slow", function() {
              direction = next_direction
              if (direction == 'show') { 
                my.bind('mouseover', over) 
                self.base.unbind('mouseleave', over) 
              }
              else { 
                my.unbind('mouseover', over) 
                self.base.bind('mouseleave', over) 
              }
            })
          })
          jq_hide.length && setTimeout(function() { jq_hide.trigger('click') }, 750)
          
        }
        this.base.fadeIn('fast')
      }
      this.base.trigger("jRollover.ready", [this.nowVisible(), this.items])
    }

  Rollover.prototype.nowVisible = function() {
    var window_margin = this.list.css("margin-left").replace('-', "");
    for(var i = this.items.length-1; i>= 0; --i) {
      var left = this.items[i].css('left').replace('-', "")
      if (window_margin === left) {
        return this.items[i];
      }
    }
    return null;
  } 

  Rollover.prototype.prev = function() {
    if (this.items.length <= this.visible_items) { return }
    if (this.options.isGallery && this.first() <= 0) {
      self.base.trigger("jRollover.reachedLeft") 
      return
    }
    var prev = ((this.first()+this.items.length)-1)%this.items.length
    var left = parseInt(this.items[this.first()].css('left'),10)-this.item_width
    this.items[prev].css('left', left)
    this.items_first = prev 
    this.base.trigger("jRollover.Prev");
    var self = this;
    this.direction(+1, function() { self.base.trigger("jRollover.nowVisible", [self.nowVisible(), self.items]); })
  }

  Rollover.prototype.next = function() {
    if (this.items.length <= this.visible_items) { return }
    if (this.options.isGallery && this.first() + this.visible_items >= this.items.length) {
      self.base.trigger("jRollover.reachedRight", ) 
      return
    }
    
    var next = (this.first()+this.visible_items)%this.items.length
    var left = parseInt(this.items[this.last()].css('left'),10)+this.item_width
    this.items[next].css('left', left + 'px')
    this.items_first = (this.first()+1)%this.items.length
    this.base.trigger("jRollover.Next");
    var self = this;
    this.direction(-1, function() { self.base.trigger("jRollover.nowVisible", [self.nowVisible(), self.items]); }) 
  }

  Rollover.prototype.direction = function(direction, completed) {
    var left = parseInt(this.list.css('margin-left'), 10)
    var self = this
    this.list.animate({"margin-left": left+(direction*this.item_width)+"px"}, 
      "fast", 
      function(){  self.sliding = false; completed && completed() })
  }

  Rollover.prototype.first = function() {
    return this.items_first
  }
  Rollover.prototype.last = function() {
    return (this.items_first+this.visible_items-1)%this.items.length
  }

  $.fn.jRollover = function(option) {
    $(this).each(function() {
      new Rollover($(this), option)
    })
    return this;
  }

  $.fn.jGallery = function(option) {
    option.isGallery = true
    $(this).each(function() {
//console.log("create carousel on:", $(this));
      new Rollover($(this), option)
    })
    return this;
  }

})(jQuery)
