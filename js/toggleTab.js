function tabContent() {
					var index = 0;
					var timer = null;
					var listLi = $('#tabs1 li');
					var tabDiv = $('.tab-content div');
					$(tabDiv).each(function() {
						$(this).mouseenter(function() {
							clearInterval(timer);
						}).mouseleave(function() {
							timer = setInterval(autoPlay, 2000);
						})
					})
					$(listLi).each(function(index) {
						$(this).attr("id", index)
						$(this).mouseenter(function() {
							clearInterval(timer);
							changeOption(this.id);
						}).mouseleave(function() {
							timer = setInterval(autoPlay, 2000);
						})
					})
					if(timer) {
						clearInterval(timer);
						timer = null;
					}
					timer = setInterval(autoPlay, 2000);
					function autoPlay() {
						index++;
						if(index >= listLi.length) {
							index = 0;
						}
						changeOption(index);
					}

					function changeOption(curIndex) {
						$(listLi).each(function(index) {
							$(listLi).eq(index).removeClass('active');
							$(tabDiv).eq(index).hide();
						})
						$(listLi).eq(curIndex).addClass('active');
						$(tabDiv).eq(curIndex).show();
						index = curIndex;
					}

				}