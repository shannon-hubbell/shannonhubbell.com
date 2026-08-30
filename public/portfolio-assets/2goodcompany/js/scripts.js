/*jshint devel:true */

/*

"Where We've Been" Slideshow

*/
/*
function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};
*/

// Fn to allow an event to fire after all images are loaded
$.fn.imagesLoaded = function () {

    // Edit: in strict mode, the var keyword is needed
    var $imgs = this.find('img[src!=""]');
    // if there's no images, just return an already resolved promise
    if (!$imgs.length) {return $.Deferred().resolve().promise();}

    // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
    var dfds = [];  
    $imgs.each(function(){

        var dfd = $.Deferred();
        dfds.push(dfd);
        var img = new Image();
        img.onload = function(){dfd.resolve();};
        img.onerror = function(){dfd.resolve();};
        img.src = this.src;

    });

    // return a master promise object which will resolve when all the deferred objects have resolved
    // IE - when all the images are loaded
    return $.when.apply($,dfds);

};

$.fn.makeImageArray = function(){
	var images = [];
	images[0] = [];
	images[0][0] = [];
	var tableNum = 0;
	var rowNum = 0;
	$(this).find('slide').each(function(index){
		var image = {
			'file': $(this).find('image').text(),
			'caption': $(this).find('caption').text(),
			'index': index + 1
		};
		if( index !== 0 ) {
			if( index % 3 === 0 ){
				++rowNum;
				if( index % 9 === 0) {
					rowNum = 0;
					++tableNum;
					images[tableNum] = [];
				}
				images[tableNum][rowNum] = [];

			}
		}
		images[tableNum][rowNum].push(image);
	});
	//shuffle(images);
	return images;
};

function makeThumbsClickable(xml){
	$('#where-gallery table.active img').unbind('click').click(function(){

		var index = parseInt($(this).data('index'));
		var fileName = $(xml).find('slide:nth-child('+index+')').find('image').text();
		var caption = $(xml).find('slide:nth-child('+index+')').find('caption').text();
		var imageTag = '<img src="slide-images/' + fileName + '" class="fullsize" data-index="'+index+'" title="'+caption+'">';

		$('#where-gallery .gallery-button').css('display','block');

		$('#where-gallery').removeClass('gallery-view').addClass('single-view').append(imageTag);

		$('#where-gallery .caption').text(caption);

		$('#where-gallery.single-view .arrow').unbind('click').click(function(){
			var newFileName = '';
			var newCaption = '';
			if($(this).hasClass('next')){
				if(index < $(xml).find('slide').length){
					index++;
					newFileName = $(xml).find('slide:nth-child('+index+')').find('image').text();
					newCaption = $(xml).find('slide:nth-child('+index+')').find('caption').text();
				} else {
					newFileName = $(xml).find('slide:first-child()').find('image').text();
					newCaption = $(xml).find('slide:first-child()').find('caption').text();
					index = 1;
				}
			} else if($(this).hasClass('previous')){
				if(index > 1){
					index--;
					newFileName = $(xml).find('slide:nth-child('+index+')').find('image').text();
					newCaption = $(xml).find('slide:nth-child('+index+')').find('caption').text();
				} else {
					newFileName = $(xml).find('slide:last-child()').find('image').text();
					newCaption = $(xml).find('slide:last-child()').find('caption').text();
					index = $(xml).find('slide').length;
				}
			}
			$('#where-gallery img.fullsize').attr('src', 'slide-images/' + newFileName);
			$('#where-gallery .caption').text(newCaption);
		});
	});	
}


function createImageTables(images) {
	var tables = '';
	var firstTable = true;

	// Create table tags!
	tables += '<div class="slides-wrapper">';
	//tables += '<table class="bkgd" width="100%"><tr><td><img src="img/slide-bkgd.gif" alt=""></td><td><img src="img/slide-bkgd.gif" alt=""></td><td><img src="img/slide-bkgd.gif" alt=""></td></tr><tr><td><img src="img/slide-bkgd.gif" alt=""></td><td><img src="img/slide-bkgd.gif" alt=""></td><td><img src="img/slide-bkgd.gif" alt=""></td></tr><tr><td><img src="img/slide-bkgd.gif" alt=""></td><td><img src="img/slide-bkgd.gif" alt=""></td><td><img src="img/slide-bkgd.gif" alt=""></td></tr></table>';
	for (var t = 0; t < images.length; t++) {
		if(firstTable){
			tables += '<table width="100%" class="active">';
			firstTable = false;	
		} else {
			tables += '<table width="100%">';
		}


		// Create row tags!
		for (var r = 0; r < images[t].length; r++){
			tables += '<tr>';

			// Create cells with images inside!
			for (var c = 0; c < images[t][r].length; c++){
				var file = images[t][r][c].file;
				var caption = images[t][r][c].caption;
				var index = images[t][r][c].index;
				tables += '<td>';
				tables += '<img src="slide-images/' + file +'" title="' + caption + '" alt="' + caption + '" data-index="' + index + '">';
				tables += '</td>';
			}

			tables += '</tr>';
		}

		tables += '</table>';
	}
	tables += '</div>';
	tables += '<div class="caption"></div>';
	tables += '<div class="arrow gallery previous">Previous</div><div class="arrow gallery next">Next</div>';
	return tables;
}

var whereGallerySpeed = 400;

function galleryViewArrows(xml){

		$('#where-gallery.gallery-view .arrow').unbind('click').click(function(){
			$('#where-gallery table.bkgd').fadeIn(2000);
			if($(this).hasClass('next')){

				if($('#where-gallery table.active').is(':last-child')){
					$('#where-gallery table.active').transition({
						opacity: 0
					}, whereGallerySpeed, function(){
						$(this).removeClass('active').hide();
						$(this).siblings(':first-child').show().transition({
							opacity: 1
						}, whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				} else {
					$('#where-gallery table.active').transition({
						opacity: 0
					}, whereGallerySpeed, function(){
						$(this).hide().removeClass('active');
						$(this).next().show().transition({
							opacity: 1
						}, whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				}
			} else if($(this).hasClass('previous')){

				if($('#where-gallery table.active').is(':first-child')){
					$('#where-gallery table.active').transition({
						opacity: 0
					}, whereGallerySpeed, function(){
						$(this).hide().removeClass('active');
						$(this).siblings(':last-child').show().transition({
							opacity: 1
						}, whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				} else {
					$('#where-gallery table.active').transition({
						opacity: 0
					}, whereGallerySpeed, function(){
						$(this).hide().removeClass('active');
						$(this).prev().show().transition({
							opacity: 1
						}, whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				}
			}
		});

}

/*
function galleryViewArrows(xml){

		$('#where-gallery.gallery-view .arrow').unbind('click').click(function(){
			$('#where-gallery table.bkgd').fadeIn(2000);
			if($(this).hasClass('next')){

				// hide bkgd boxes on last page
				if($('#where-gallery table.active').next().is(':last-child')){
					$('#where-gallery table.bkgd').fadeOut(2000);
				}

				if($('#where-gallery table.active').is(':last-child')){
					$('#where-gallery table.active').fadeOut(whereGallerySpeed, function(){
						$(this).removeClass('active');
						$(this).siblings(':first-child').fadeIn(whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				} else {
					$('#where-gallery table.active').fadeOut(whereGallerySpeed, function(){
						$(this).removeClass('active');
						$(this).next().fadeIn(whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				}
			} else if($(this).hasClass('previous')){

				// hide bkgd boxes on last page
				if($('#where-gallery table.active').is(':first-child')){
					$('#where-gallery table.bkgd').fadeOut(2000);
				}

				if($('#where-gallery table.active').is(':first-child')){
					$('#where-gallery table.active').fadeOut(whereGallerySpeed, function(){
						$(this).removeClass('active');
						$(this).siblings(':last-child').fadeIn(whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				} else {
					$('#where-gallery table.active').fadeOut(whereGallerySpeed, function(){
						$(this).removeClass('active');
						$(this).prev().fadeIn(whereGallerySpeed, function(){
							makeThumbsClickable(xml);	
						}).addClass('active');
					});
				}
			}
		});

}

*/

function ajaxFormSubmit(){
	$('#contact-form').submit(function(event){
		event.preventDefault();
		$.post('contact.php',$(this).serialize(), function(data){
			$('#form-wrapper').html(data);
			ajaxFormSubmit();
		});
	});
}


$(document).ready(function(){

// STICKY HEADER
	$(window).scroll(function(){
		if($(this).scrollTop() > 28){
			$('body').addClass('scrolled');
		} else {
			$('body').removeClass('scrolled');
		}
	});

// SCROLLING NAVIGATION
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') || location.hostname === this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			   if (target.length) {
				 $('html,body').animate({
					 scrollTop: target.offset().top - 90
				}, 1000);
				return false;
			}
		}
	});

// ACTIVE STATES ON NAVIGATION WHEN CLICKED
	var selector = '#main-nav li a';
	$(selector).on('click', function(){
		$(selector).removeClass('active');
		$(this).addClass('active');
	});

// ACTIVE STATES ON NAVIGATION WHEN SCROLLED
	var sections = $('section'),
		nav = $('nav'),
		nav_height = nav.outerHeight();

		$(window).on('scroll', function () {
			var cur_pos = $(this).scrollTop();

			sections.each(function() {
			var top = $(this).offset().top - nav_height,
			bottom = top + $(this).outerHeight();

			if (cur_pos >= top && cur_pos <= bottom) {
				nav.find('a').removeClass('active');
				sections.removeClass('active');

				$(this).addClass('active');
				nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
			}
		});
	});

// FADE-IN ELEMENTS
// fade on page load
	$('.fade-in-on-load').fadeIn(5000);
// fade on page scroll
    $(window).scroll( function(){
        // Check the location of each thing
        $('.fade-in-on-scroll').each( function(){
			var bottom_of_object = $(this).offset().top + $(this).outerHeight();
			var bottom_of_window = $(window).scrollTop() + $(window).height();

		// only fade in when the element is fully loaded in the viewport
            if( bottom_of_window > bottom_of_object ){
				// must use opacity for this one simple display:none does not detect height correctly
                $(this).animate({'opacity':'1'},1500);
            }
        });
    });


// work slideshow
	$('#work-slider li').fitVids();
	$('#work-slider .description h3').html($('#work-slider ul .active').data('title'));
	$('#work-slider .description p').html($('#work-slider ul .active').data('desc'));

	$('#work-slider .arrow').click(function(event){
		event.preventDefault();
		if(!$(this).hasClass('disabled')){

			var newSlide;

			if($(this).hasClass('next')){
				newSlide = $('#work-slider ul .active').next();
			} else if ($(this).hasClass('prev')) {
				newSlide = $('#work-slider ul .active').prev();
			}

			if($('#work-slider ul .active').is(':first-child')){
				$('#work-slider .arrow.prev').removeClass('disabled');
			} else if($('#work-slider ul .active').is(':last-child')){
				$('#work-slider .arrow.next').removeClass('disabled');
			}

			if(newSlide.is(':first-child')){
				$('#work-slider .arrow.prev').addClass('disabled');
			} else if(newSlide.is(':last-child')){
				$('#work-slider .arrow.next').addClass('disabled');
			}

			var title = newSlide.data('title');
			var desc = newSlide.data('desc');

			if($('#work-slider ul .active iframe').length>0){
				$('#work-slider ul .active iframe').vimeo('pause');
			}

			$('#work-slider ul .active').removeClass('active');
			newSlide.addClass('active');
			$('#work-slider .description h3').html(title);
			$('#work-slider .description p').html(desc);


		}
	});


//testimonial slideshow
	$('#quotes-slideshow').slippry({
		pause: 7500,
		controls: false
	});

// Contact Form
	ajaxFormSubmit();


	$('#load-where-slideshow').click(function(){

		if(!$('#where-gallery .slides-wrapper').length){

			$.get('slide-images/slides.xml', function(xml){

				var slidesArray = $(xml).makeImageArray();

				// Populate Gallery
				$('#where-gallery').append(createImageTables(slidesArray)).imagesLoaded().then(function(){
					// Arrow Functionality for Gallery View
					galleryViewArrows(xml);

					// Launch Image
					makeThumbsClickable(xml);
					
					$('#where-gallery .gallery-button').click(function(){
						$(this).css('display','none');
						$('#where-gallery').removeClass('single-view').addClass('gallery-view');
						galleryViewArrows(xml);
						$('#where-gallery img.fullsize').remove();
						$('#where-gallery .caption').empty();
					});		

					$('#where .background, #where .binding').addClass('gallery-launched');

					$('#where-gallery').show().transition({
						opacity: 1
					},1500, function(){
						$('#where-gallery .close').click(function(){
							$('#where .background, #where .binding').removeClass('gallery-launched');
							$('#where-gallery').transition({
								opacity: 0
							}, 500, function(){
								$('#where-gallery').find('.slides-wrapper, .caption, .arrow, .fullsize').remove();
								$('#where-gallery .gallery-button').css('display','none');
							}).hide();
						});
					});		

				});

			});
			
		}

	});

});
