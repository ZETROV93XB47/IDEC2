var swiperOptions = {
	slidesPerView: slidesPerView,
	slidesPerGroup: 1,
	centeredSlides: true,
	pagination: “pdf-viewer.” + viewerClass + “ .pagination-container .swiper-pagination”,
	spaceBetween: 10,
	initialSlide: 0,
	paginationType: ‘fraction’,
	loop: false,
	zoom: false,
	zoomMax: 1.5,
	zoomMin: 1,
	nextButton: ‘.swiper-button-next’,
	prevButton: ‘.swiper-button-prev’,
	keyboardControl: true,
	preloadImages: true,
	updateOnImagesReady: true,
	lazyLoading: false,
	watchSlidesVisibility: false,
	lazyLoadingInPrevNext: true,
	lazyLoadingOnTransitionStart: false,
	breakpoints: { 1024: { zoomMax: 3 } },

	paginationFractionRender: function (swiper, currentClassName, totalClassName) {
		return ‘<span class=“’ + currentClassName + ‘”></span>’ +‘/’ +‘<span class=“’ + totalClassName + ‘”></span>’;
	},
	
	onInit: function (swiper) 
	{
		swiper.enableKeyboardControl();
		//controls
		buttonPrevious.removeClass(“disabled”);
		buttonNext.removeClass(“disabled”);
		if (swiper.isBeginning) 
		{
			//first slide
			buttonPrevious.addClass(“disabled”);
		} 
		else if (swiper.isEnd) 
		{
			//last slide
			buttonNext.addClass(“disabled”);
		}
		buttonPrevious.off(“click”);
		buttonPrevious.on(“click”, function (e) {
			swiper.slidePrev(true);
		});
		buttonNext.off(“click”);
		buttonNext.on(“click”, function (e) {
			swiper.slideNext(true);
		});
	},
	
	onImagesReady: function (swiper) 
	{
		//this is to position the slides correctly; because on very first load when the cache is empty the first slide is a bit off
		swiper.slideTo(swiperOptions.initialSlide, 0, false);
	},
	
	onTransitionStart: function (swiper) 
	{
		//controls
		buttonPrevious.removeClass(“disabled”);
		buttonNext.removeClass(“disabled”);
		if (swiper.isBeginning) 
		{
			buttonPrevious.addClass(“disabled”);
		}
		if (swiper.isEnd) 
		{
			buttonNext.addClass(“disabled”);
		}
	},
	
	onBeforeResize: function (swiper) 
	{
		swiperOptions.oldWidth = swiper.width;
		swiperOptions.oldHeight = swiper.height;
	},
	
	onAfterResize: function (swiper) 
	{
		//on after resize reinit swiper
		var activeIndex = swiper.activeIndex;
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		if (viewportHeight > viewportWidth) 
		{
			//orientation portrait
			swiperOptions.slidesPerView = 1;
			if (swiperOptions.oldHeight <= swiperOptions.oldWidth) 
			{
				//if orientation change from landscape to portrait
				if (activeIndex === 0) 
				{
					swiperOptions.initialSlide = activeIndex;
				} 
				else 
				{
					swiperOptions.initialSlide = activeIndex + (activeIndex – 1);
				}
				swiper.destroy(true, true);
				$(“pdf-viewer.” + viewerClass + “ div.swiper-wrapper”).replaceWith(“<div class='swiper-wrapper'></div>”);
				paginationContainer.html(“<div class='swiper-pagination'></div>”);
				insertSlides(result);
				//fix for the firefox and IE
				var containerHeight = $(“pdf-viewer.” + viewerClass + “ .swiper-zoom-container”).height();
				$(“pdf-viewer.” + viewerClass + “ .zoom-container”).css(“height”, containerHeight + “px”);
				//init swiper
				idSwiper = new Swiper(“pdf-viewer.” + viewerClass + “ .swiper-container”, swiperOptions);
			} 
			else 
			{
				//if we're just resizing portrait
				//fix for the firefox and IE
				var containerHeight = $(“pdf-viewer.” + viewerClass + “ .swiper-zoom-container”).height();
				$(“pdf-viewer.” + viewerClass + “ .zoom-container”).css(“height”, containerHeight + “px”);
			}
		} 
		else 
		{
			//orientation landscape
			swiperOptions.slidesPerView = ‘auto’;
			if (swiperOptions.oldHeight > swiperOptions.oldWidth)
			{
				//if orientation change from portrait to landscape
				if (activeIndex === 0) swiperOptions.initialSlide = activeIndex;
				else swiperOptions.initialSlide = Math.floor((activeIndex + 1) / 2);
				swiper.destroy(true, true);
				$(“pdf-viewer.” + viewerClass + “ div.swiper-wrapper”).replaceWith(“<div class='swiper-wrapper'></div>”);
				paginationContainer.html(“<div class='swiper-pagination'></div>”);
				insertSlides(result);
				//fix for the firefox and IE
				var containerHeight = $(“pdf-viewer.” + viewerClass + “ .swiper-zoom-container”).height();
				$(“pdf-viewer.” + viewerClass + “ .zoom-container”).css(“height”, containerHeight + “px”);
				//init swiper
				idSwiper = new Swiper(“pdf-viewer.” + viewerClass + “ .swiper-container”, swiperOptions);
			} 
			else 
			{
				//if we're just resizing landscape
				//fix for the firefox and IE
				var containerHeight = $(“pdf-viewer.” + viewerClass + “ .swiper-zoom-container”).height();
				$(“pdf-viewer.” + viewerClass + “ .zoom-container”).css(“height”, containerHeight + “px”);
			}
		}
	}
};