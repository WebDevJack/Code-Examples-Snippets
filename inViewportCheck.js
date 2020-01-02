/*

  JQUERY function: Checks if an element is in the current DOM viewport then returns true / false.
  
  Tip: Add to a window.scroll() DOM event to run when user scrolls page, then do something. E.G fade in elements.

*/

<script>

$(document).ready( function() {

	$.fn.inViewport = function() {
  
	// $.fn. adds function to JQUERY, so it can be used in its syntax E.G $(".someDiv").inViewport() - returns true || false"
  
		let eleTop          =   $(this).offset().top,
		    viewportTop     =   $(window).scrollTop(),
		    eleBottom       =   $(this).outerHeight() + eleTop,
		    viewportBottom  =   viewportTop + $(window).height(); // <!DOCTYPE html> must be set
			
		return eleBottom > viewportTop && eleTop < viewportBottom;
	};
  
 });

</script>
