define(function(require){

	var $ = require('jquery');

	var TweenLite = require('lib/tween/TweenLite');

	var ContentSectionManager = require('ContentSectionManager');


	var debugTemplate = '<div class="debug" style="position:fixed; z-index: 1000; width: 80%; height: 100%; overflow: hidden;"></div>'


	var Main = function(){

		//	$debug = $(debugTemplate);
		//	$('body').prepend($debug);

		var self = this;

		this.$scrollContainer = $(window); //'html, body'
		this.$layoutContent = $('.layoutContent');
		this.$tri = $('.triangleWhite');
		this.$fixed = $('.fixed');

		this.scrollProgress = 0;

		this.autoScrollingAllowed = true;

		this.touchDeltaX = 0;
		this.touchDeltaY = 0;

		this.isIOS = this.iosCheck();

		if (this.isIOS)
		{
			// $('video').attr('controls', 'true');

			//	$('video').each(function(i){
			//		var $vid = $(this);
			//		var src = 'video/' + (i+1) + '.jpg';
			//		var animatedSrc = 'video/' + (i+1) + '.gif';
			//		var $vidGif = $('<img class="videoGif" src="' + src + '" />');
			//		$vid.replaceWith($vidGif);
			//		$vidGif
			//		.data('src', src)
			//		.data('animatedsrc', animatedSrc);
			//	})

		}

		$('.mobileMenuBtn').click(function(){

			//
			//css('display', 'block');

			if ($('.menuContainer').css('display') == 'none')
			{
				$('.menuContainer').toggle();

				$('.menuContainer .menu').animate({
					//	top: "0px",
					height: "100%"
				},
				{
					duration: 400,
					complete: function()
					{
						// console.log("menu in!")
						self.resize();
						//	$('.menuContainer .menu').css('visibility', 'visible');
					}
				});
			}
			else
			{
				$('.menuContainer .menu').animate({
					//	top: "0px",
					height: "0%"
				},
				{
					duration: 400,
					complete: function()
					{
						//	console.log("menu out!")
						$('.menuContainer').toggle();
						self.resize();
						//	$('.menuContainer .menu').css('visibility', 'visible');
					}
				});
			}
		});

		this.$sections = $('.content');

		var self = this;

		if (this.$sections.length > 1)
		{
			var $sectionLinks = $('<div class="sectionLinks"></div>');
			$('body').append($sectionLinks);

			this.sectionManager = new ContentSectionManager();
			this.sectionManager.setContext($sectionLinks);
			for (var i=0, len=this.$sections.length; i<len; i++)
			{
				this.sectionManager.addSection(this.$sections[i]);
			}

			this.sectionManager.on.change.add(function(i, forceAnimation){
				if (self.currentSection != i)
				{
					if (self.fontsReady)
					{
						self.parallaxTo(i);
					}

					var lastPos = self.getSectionScrollPos(self.currentSection || 0);
					self.currentSection = i;

					if (!self.autoScrollingAllowed && !forceAnimation) return;



					//	console.log('sectionManager change', i)


					var targetPos = self.getSectionScrollPos(i);

					var currentPos = self.getScrollProgress();
					//	console.log('lastPos', lastPos);
					//	console.log('currentPos', currentPos);
					//	console.log('targetPos', targetPos);

					var time
					var totalChange = (targetPos - lastPos);
					if (totalChange != 0)
					{
						time = Math.abs((currentPos - targetPos)  / totalChange);
					}
					else
					{
						time = 0;
					}

					//	console.log('time:', time, (currentPos - targetPos)  , (targetPos - lastPos));

					self.scrollTo( targetPos , time);


				}
			});

			this.sectionManager.setActiveSection(0);


			//console.log('setup section scroll');
			this.currentSection = 0;

			$(window).scroll(function(event){
				event.preventDefault();
				//	console.log('natural scroll', self.ignoreScroll);
				self.onScroll(event);
				return false;
			});

			$(window).mousedown(function(){
				//	console.log('mouse down');
				self.mousedown = true;
			});
			$(window).bind('mouseup', function(){
				//	console.log('mouse up');
				self.mousedown = false;
			});

			$(document).keydown(function(e){

				if (e.keyCode == 37 || e.keyCode==38) {
					//alert( "left/up pressed" );
									e.preventDefault();
					self.prevDown = e.keyCode;
					//return false;
				}

				if (e.keyCode == 39 || e.keyCode==40 || e.keyCode==32) {
					//alert( "right/down pressed" );
									e.preventDefault();
					self.nextDown = e.keyCode;
					//return false;
				}
			});

			$(document).keyup(function(e){
				//	console.log('keyup')
				//	console.log(self.prevDown, self.nextDown, e.keyCode)

				if (self.autoScrolling == false)
				{
					if (self.prevDown == e.keyCode) {
						self.prevSection();
					}

					if (self.nextDown == e.keyCode) {
						self.nextSection();
					}
				}


				if (e.keyCode == 37 || e.keyCode==38) {
					self.prevDown = false;
					//return false;
				}

				if (e.keyCode == 39 || e.keyCode==40 || e.keyCode==32) {
					self.nextDown = false;
					//return false;
				}
			});

			$(document).bind('mousewheel DOMMouseScroll', function(event) {
				event.preventDefault();
				var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
				self.onScroll(event, delta);
				return false;
			});

			$(document).bind('touchstart', function(event){
				var x = event.originalEvent.targetTouches[0].pageX,
					y = event.originalEvent.targetTouches[0].pageY;
					//console.log('touch',x,y)

					self.touchStartX = x;
					self.touchStartY = y;
					self.touchLastX = x;
					self.touchLastY = y;
					self.touching = true;
					self.isTouch = true;

				if (self.autoScrolling)
				{
					self.autoScrolling = false;
					//console.log('kill');
					if (self.scrollTl) {
						self.scrollTl.kill();
					}
				}

			});

			$(document).bind('touchmove', function(event){

				event.preventDefault();

				//
				var x = event.originalEvent.targetTouches[0].pageX,
					y = event.originalEvent.targetTouches[0].pageY;

					//var scrollX = $('html').scrollLeft() || $('body').scrollLeft();
					var scrollY = self.$scrollContainer.scrollTop(); //$('html').scrollTop() || $('body').scrollTop();//self.getScrollProgress();

					var deltaY = y-self.touchLastY;


				//self.touchDeltaX = x - self.touchStartX;



				self.touchDeltaY = y - self.touchStartY;
				self.touchLastY = y;

				//	console.log('touch move', deltaY, self.touchDeltaY); //x-scrollX,

				self.scrollProgress -= deltaY;

				var transform = 'translate(' + 0 + 'px, ' + -self.scrollProgress + 'px)';

				self.$layoutContent.css({
					'transform': transform,
					'-ms-transform': transform, /* IE 9 */
					'-webkit-transform': transform /* Safari and Chrome */
				});






				//.css('top', self.touchDeltaY);//scrollTop(scrollY - deltaY); //y - self.touchDeltaY




			});

			$(document).bind('touchend', function(event){
				//console.log('touch end');
				self.touching = false;
				self.touchStartX = null;
				self.touchStartY = null;
				//	var newScroll = self.$scrollContainer.scrollTop() - self.touchDeltaY;
				//	console.log('newScroll', newScroll);
				//	self.$scrollContainer.scrollTop(newScroll); //($('html').scrollTop() || $('body').scrollTop())
				//	$('body').css('top', 0);
				self.onScroll();

				//self.touchDeltaX = self.touchDeltaY = 0;


			});


		}

		var initTypekit = function()
		{
			//	console.log('initTypekit');
			try {
				Typekit.load({
					loading: function() {
					//	alert('loading!');
					},
					active: function() {
						//	alert('active!');
						self.onFontsReady();
					},
					inactive: function() {
						//	console.log('typekit inactive!');
						self.onFontsReady();
					//	initTypekit();
					//	alert('inactive!');
					}
				});
			} catch(e) {
				console.error(e);
			}
		}

		$(function(){
			initTypekit();
		});
	};

	var p = Main.prototype;

	p.iosCheck = function()
	{
		var ua = navigator.userAgent,
		isIPAD = ua.match(/(iPad)/),
		isIOS = ua.match(/(iPhone|iPod|iPad)/);

		return isIOS;
	}

	p.onFontsReady = function ()
	{
		var self = this;

		$(window).resize(function(){
			self.resize();
		});
		this.resize(true);

		$(window).scroll(function(){
			self.scroll();
		});


		//restore visibility!!!
		//alert('vis!')

		$("#contextView").css('visibility', 'visible');

		this.fontsReady = true;
		this.parallaxTo(0);
	};

	p.resize = function(isInit)
	{
		var w = $(window).width();

		this.detectMobileDesktop($('html').width());

		var headerPadding = 49 + $(".fixedTop").height();
		$(".content").css("padding-top", headerPadding);

		if (this.$sections.length > 1)
		{
			//vertically center 1st content area
			var $section = $($(".content")[0]);
			var vPos = Math.max(0, ($section.height() - $section.children().height())/2 - 50) ;
			$section.children().first().css("margin-top", vPos);
		}



		var pos = Math.floor((w-960)/2);
		pos = Math.max(0, pos);

		var bg_pos;

		if (this.$tri.length > 0)
		{
			if (w > 960)
			{
				bg_pos = Math.max(960+440, w+440-pos) - 5000;
				this.$tri.css({
					'left': -pos + 'px',
					'width': w + 'px',
					'background-position': bg_pos + 'px 0px'
				});
			}
			else
			{
				bg_pos = Math.max(960+440, w+440-pos) - 1400;

				this.$tri.css({
					'left': 'auto',
					'width': w + 'px',
					'background-position': bg_pos + 'px 0px'
				});
			}
		}
		//	$layoutContent.css({
		//		'width': Math.min(w, 960) + 'px'
		//	});

		this.scroll();

		this.setAutoScrollingAllowed();



		if (isInit!=true && this.$sections.length > 1)
		{

			var $section = $(this.$sections[this.currentSection]);
			if ((($section.height() - $section.children().height()) > 49))
			{
				this.scrollToSection(this.currentSection, true);
			}
		}


	};

	p.detectMobileDesktop = function(w){
		if (w < 960)
		{
			if (this.isMobile != true)
			{
				this.changeToMobile();
			}
		}
		else
		{
			if (this.isMobile != false)
			{
				this.changeToDesktop();
			}
		}
	};

	p.changeToMobile = function()
	{
		this.isMobile = true;
		var $elements = $('[data-mobileclasses], [data-desktopclasses]');

		$elements.each(function(){
			var $item = $(this);
			$item.removeClass($item.data('desktopclasses'));
			$item.addClass($item.data('mobileclasses'));
		})

		//	console.log('change to mobile', $elements);
	};

	p.changeToDesktop = function()
	{
		this.isMobile = false;

		var $elements = $('[data-mobileclasses], [data-desktopclasses]');

		$elements.each(function(){
			var $item = $(this);
			$item.removeClass($item.data('mobileclasses'));
			$item.addClass($item.data('desktopclasses'));
		})

		//	console.log('change to desktop', $elements);
	};

	p.scroll = function()
		{
			//todo: check if changed
			var x = this.$layoutContent[0].getBoundingClientRect().left;
			//	console.log(x);

			this.$fixed.css('left', Math.min(0, x) + 'px');
		};

	p.setAutoScrollingAllowed =function()
	{
		this.autoScrollingAllowed = true;

		var self = this;

		this.$sections.each(function(){
			$section = $(this);
			
			/*
			Disable Smooth Scrolling
			if (($section.height() - $section.children().eq(0).height()) < 50)
			{
				//self.autoScrollingAllowed = false;
			}*/

		});
	};

	p.onScroll = function(event, delta)
	{
		//	console.log('onScroll');

		//$debug.append('onScroll ' + this.autoScrolling + ' delta ' + delta);

		if (this.scrollEndTimeoutId)
		{
			clearTimeout(this.scrollEndTimeoutId);
		}

		if (!this.autoScrolling)
		{
			if (this.mousedown)
			{
				//mouse
				//console.log('mouse!');
				this.scrollByMouse();
			}
			else if (this.isTouch && !this.touching && (this.touchDeltaX != 0 || this.touchDeltaY !=0))
			{
				//touch
				//	console.log('touch end!');
				if (Math.abs(this.touchDeltaY) > 0)
				{
					this.startAutoScroll();
					this.touchDeltaX = 0;
					this.touchDeltaY = 0;
				}
			}
			else if (this.nextDown || this.prevDown)
			{
				//key
				//	console.log('key!');
				// already listening
			}
			else
			{
				//	console.log('wheel', delta);
				if (delta != undefined)
				{
					this.handleScrollWheel(delta);
				}
			}
		}


	};

	p.scrollByMouse = function()
	{
		//	console.log('scrollByMouse');

		var self = this;

		this.scrollEndTimeoutId = setTimeout(function()
		{
			self.startAutoScroll(true);
		}, 500);

		//	this.autoScrolling = true;

//		$(window).mouseup(function(){
			//	alert ('find delta');



			//	for (var i=0, len=self.$sections.length; i<len; i++)
			//	{
			//		console.log(self.scrollProgress, self.getSectionScrollPos(i));
			//	}

			//	console.log('* * *');

		//		$(window).unbind('mouseup', arguments.callee);
		//	});
	};

	p.getClosestSectionIndex = function()
	{
		var scrollProgress = this.getScrollProgress();

		var targetSection = this.currentSection;
		var minDist = 10000;

		for (var i=0, len=this.$sections.length; i<len; i++)
		{
			var $section = this.$sections[i];
			var sectionPos = this.getSectionScrollPos(i);
			var dist = Math.abs(scrollProgress - sectionPos);

			if (dist < minDist)
			{
				targetSection = i;
				minDist = dist;
			}
		}

		return targetSection;
	}

	p.getScrollProgress = function()
	{
		if (this.isIOS)
		{
			return this.scrollProgress;
		}
		else
		{
			var p = this.$scrollContainer.scrollTop() || $('html').scrollTop();// || $('body').scrollTop();

			if (this.touchDeltaY != undefined)
			{
				//console.log('scrollProgress', p, ' + ', this.touchDeltaY);
				p -= this.touchDeltaY;
			}

			//	console.log('getScrollProgress() ', p)
			return p;
		}
	}

	p.startAutoScroll = function(useClosest)
	{
		this.scrollProgress = this.getScrollProgress();

		if (useClosest)
		{
			//console.log('scroll to closest')
			var targetSection = this.getClosestSectionIndex();
			var $section = $(this.$sections[targetSection]);

			//	console.log("###", $section.height() , $section.height() - $section.children().height());
			if (targetSection != this.currentSection
					||
				this.autoScrollingAllowed)
			{
				this.scrollToSection(targetSection, true);
			}
			else
			{
				this.sectionManager.setActiveSection(targetSection);
			}
			return;
		}


		var currentPos = this.getSectionScrollPos(this.currentSection);

		//	console.log('startAutoScroll:', this.currentSection, this.scrollProgress, currentPos);

		if (this.scrollProgress > currentPos)
		{
			if (Math.abs(this.scrollProgress - currentPos) > 2)
			{
				this.nextSection()
			}
			else
			{
				//	this.scrollTo(currentPos);
			}
		}
		else if (this.scrollProgress < currentPos)
		{
			if (Math.abs(this.scrollProgress - currentPos) > 2)
			{
				this.prevSection()
			}
			else
			{
				//	this.scrollTo(currentPos);
			}
		}
	}

	//	p.waitForScrollEndKey = function()
	//	{
	//	};

	p.handleScrollWheel = function(delta)
	{
		if (this.autoScrollingAllowed)
		{
			var self = this;

			if(delta<0)
			{
				self.nextSection();
			}
			else if(delta>0)
			{
				self.prevSection();
			}
		}
		else if (Math.abs(delta) > 0)
		{
			// manual scrolling
			//	console.log('manual', delta);
			var currentPos = this.getScrollProgress();
			this.$scrollContainer.scrollTop(currentPos - delta);
			var i = this.getClosestSectionIndex();
			this.sectionManager.setActiveSection(i);
		}
	};

	p.nextSection = function()
	{
		var targetSection = this.currentSection + 1;

		if (targetSection > this.$sections.length -1) {
			targetSection = this.$sections.length -1;
		}
		//	console.log('next section', targetSection);
		this.scrollToSection(targetSection, true);
	};

	p.prevSection = function()
	{
		var targetSection = this.currentSection - 1;
		if (targetSection < 0) {
			targetSection = 0;
		}
		//	console.log('prev section', targetSection);
		this.scrollToSection(targetSection, true);
	};


	p.scrollToSection = function(i, forceAnimation)
	{
		//console.log('scrollToSection', i, forceAnimation);
		if (this.currentSection != i)
		{
			this.sectionManager.setActiveSection(i);
		}
		else if (forceAnimation)
		{
			var targetPos = this.getSectionScrollPos(i);
			this.scrollTo( targetPos );
		}

	};

	p.getSectionScrollPos = function(i)
	{
		if(i==0) return 0;

		var $section = $($('.content')[i]);

		return Math.floor($section.position().top - Math.max(49, $section.height() - $section.children().height())/2 + 50);
	}

	p.scrollTo = function(scrollDest, time)
	{
		//	console.log('scrollTo')
		if (time == undefined)
		{
			time = 1;
		}

		if (time == 0)
		{
			time = .1;
		}

		var ease = "Cubic.easeOut";
		//	ease = "Linear.easeIn";

		if (this.isIOS)
		{
			//	time *= 2;

		}

		var self = this;



		this.autoScrolling = true;



		this.scrollProgress = this.getScrollProgress();




		//	self.scrollProgress = $('html').scrollTop() || $('body').scrollTop();

		//	console.log('scroll start', scrollDest, 'from', this.scrollProgress, 'in', time);

		if (this.scrollTl) {
			this.scrollTl.kill();
		}

		var startTime = new Date();

		//	console.log('go!', time);


		this.scrollTl = TweenLite.to(self, time, {
			'scrollProgress': scrollDest,
			'delay': 0,
			'ease': ease,


			'onStart': function()
			{
				//	console.log('onStart tween', new Date()-startTime);

				//	if (self.isIOS)
				//	{
					// Removed loop that resets to starting state, moved to onComplete - Johnny
				//	}
			},

			'onUpdate': function()
			{
				//console.log('*', self.scrollProgress);

				if (self.isIOS)
				{
					var transform = 'translate(' + 0 + 'px, ' + -self.scrollProgress + 'px)';

					self.$layoutContent.css({
						'transform': transform,
						'-ms-transform': transform, /* IE 9 */
						'-webkit-transform': transform /* Safari and Chrome */
					});
				}
				else
				{
					self.$scrollContainer.scrollTop(self.scrollProgress);
				}
			},

			'onComplete': function(){
				//console.log('scrollTo complete');

				var currentVideo = $('video', self.$sections[self.currentSection])[0];
				
				//	if (!self.isIOS)
				//	{
				//		self.playVideo(currentVideo);
				//	}
				//	else
				//	{
					//detach / reattach to simulate replay
					//console.log('playGif', self.currentSection, $vid);
					var $vid = $($('.videoGif', self.$sections[self.currentSection])[0]);
					$('.videoGif').not($vid).each(function(){
						var $vid = $(this);
						$vid.attr('src', $vid.data('src'));
					});
					$vid.attr('src', $vid.data('animatedsrc'));
					//	.load(function(){
					//		$vid.css('visibility', 'visible');
					//	})

				//	}

				self.scrollTl = null;
				setTimeout(function(){
					self.autoScrolling = false;
					//re-check
						//	if (self.touchDeltaY != 0)
						//	{
						//		self.startAutoScroll();
						//		self.touchDeltaX = self.touchDeltaY = 0;
						//	}
				}, 250);
			}
		});


		//	console.log('go end!', new Date() - startTime);
	};

	p.parallaxTo = function(activeIndex)
	{
		//console.log('parallaxTo', activeIndex);
		for (var i=0, len=this.$sections.length; i<len; i++)
		{
			if (i<=activeIndex)
			{
				$(this.$sections[i]).addClass('active');
			}
			else
			{
				$(this.$sections[i]).removeClass('active');
			}

			if (i<activeIndex)
			{
				$(this.$sections[i]).addClass('past');
			}
			else
			{
				$(this.$sections[i]).removeClass('past');
			}
		}
	}

	p.playVideo = function(currentVideo)
	{
		//console.log('playVideo', currentVideo);
		var self = this;
		$('video').each(function(i){
			//	console.log(i);
			var video = $(this)[0];

			try{
				video.currentTime = 0;

				if (currentVideo == video)
				{
					//console.log('play', video);
					video.play();
				}
				else
				{
					//console.log('pause', video);
					video.pause();
				}
			}
			catch(error)
			{
				//console.log("vids not ready!")

				//video.addEventListener('oncanplay',
				setTimeout(function()
				{
					//console.log('ok, go!')
					self.playVideo(currentVideo);
				}, 2500);

				return
			}

		});
	}

	return Main;
});
