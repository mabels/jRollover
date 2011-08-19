# jRollover #

This is a rollover carousel jquery plugin.

Special Thanks to bottegaveneta and Sinnerschrader

This plugin allows to build a endless rollover 

---

This is the JS Api

    $('.scrollableItems')
      .bind("jRollover.ready", function(e, o) { console.log("ready", $(this).attr("id"), o) })
      .jRollover() 
      .bind("jRollover.Next", function() { console.log("clicked-next", $(this).attr("id")) })
      .bind("jRollover.Prev", function() { console.log("clicked-prev", $(this).attr("id")) })
      .bind("jRollover.nowVisible", function(e, o) { console.log("nowVisible", $(this).attr("id"), o) })
    $(".mynext").click(function() { console.log("myNext"); $('.scrollableItems').trigger("jRollover.stepNext") })
    $(".myprev").click(function() { console.log("myPrev"); $('.scrollableItems').trigger("jRollover.stepPrev") })

---

This is the HTML 

    <div class="scrollableItems" id="one">
      <a class="prev" href="javascript://">Previous</a>
      <a class="next" href="javascript://">Next</a>
      <div class="frame" style="width:810px;height:200px;" >
        <ul class="window">
          <li class="items">
            <img src="path/to/image.png" height="473" width="810" alt="" /> 
          </li>
        </ul>
      </div>
    </div>