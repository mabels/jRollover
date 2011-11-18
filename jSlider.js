/*
 * need some cleanup
 */

    var Slider = function() {
      this.events = { 
        fire: function(event, val) {
          for (var i = this[event].length-1; i >= 0; --i) {
            this[event][i].apply(null,val)
          }
        },
        init: [],
        change: [],
        start: [],
        stop: []
      } 
    }
    Slider.context = function(context, fn) {
    	return function() { return fn.apply(context, arguments) } 
    }    
    Slider.prototype.init = function($base) {
      this.$base = $base
      this.$bar = this.$base
      this.$handle = this.$base.find(".handle")
      this.barWidth = parseInt(this.$bar.css("width"), 10)
      this.handleWidth = parseInt(this.$handle.css("width"), 10)
      this.handleOffset = this.handleWidth/2
      this.offset = this.$bar.offset()
      this.min = ~~this.$base.attr("data-min")
      this.max = ~~this.$base.attr("data-max")
      this.range = this.max - this.min
      this.step = ~~this.$base.attr("data-step")||1
      this.lastVal = null
      this.start = this.$base.attr("data-start") || ~~(this.range/2)
	
	  this.contextMover = Slider.context(this, this.mover)

      this.$bar.bind("mousedown", Slider.context(this, function(e) {
        this.handleOffset = this.handleWidth/2
        return this.startMove(e);
      }))
      this.$handle.bind("mousedown", Slider.context(this, function(e) {
        this.handleOffset = e.pageX - this.$handle.offset().left
        return this.startMove(e);
      }))
      this.$bar.bind("mouseup", Slider.context(this, function() {
        this.$bar.unbind("mousemove", this.contextMover);
        this.events.fire("stop",   [])
      }))
      this.$bar.bind("mouseleave", Slider.context(this, function() {
        this.$bar.unbind("mousemove", this.contextMover);
        this.events.fire("stop",   [])
      }))
      
      this.events.fire("init",   [this.start])
      this.setValue(this.start);
      //this.events.fire("change", [this.start])
      return this;
    }
    Slider.prototype.setValue = function(value) {
    	this.start = value;
		var pagex = this.$bar.offset().left+(((value-this.min)/(this.range/*+step*/))*this.barWidth)
		this.mover({ preventDefault: function() {}, pageX: pagex });
		this.events.fire("change", [this.start])
    }
    Slider.prototype.mover = function(e) {
	      e.preventDefault();
	      var x = (e.pageX-this.handleOffset)-this.offset.left 
	      if (x < 0) { x = 0 } 
	      else if (x > this.barWidth-this.handleWidth) { x = this.barWidth-this.handleWidth }
	      this.$handle.blur()
	      this.$handle.css("left", x)
	      var val = (this.range*(x/(this.barWidth-this.handleWidth)))
	      val = ((~~(val/this.step))*this.step) + this.min
//console.log("val:",val,this, x, e);
	      if (this.lastVal == val) { return ; }
	      this.lastVal = val;
	      this.events.fire("change", [val, x]);
	  }
     Slider.prototype.startMove = function(e) {
        e.preventDefault();
        this.mover(e);
        this.events.fire("start",   [])
        this.$bar.bind("mousemove", this.contextMover);
        return false
      }

    Slider.prototype.bind = function(event, fn) {
      this.events[event] && this.events[event].push(fn)
      return this;
    }
