var memorymaker = window.memorymaker || {}; ( function(memorymaker) {



		memorymaker.VM = (function (){
			
			function vm (canvas)
			{
				this.display = ko.observable(true);
				this.words = ko.observable();
				this.controller = new memorymaker.Controller(canvas);
				this.controller.setup(new CanvasKit.Point(100,200));
				this.deleteContent = function ()
				{
					this.controller.deleteContent();
				};
				this.loadAndDisplay = function ()
				{
					var rawInput = this.words();
					var elements = rawInput.split(/[\n|,|;|\t]/);
					
					elements.forEach(function (element){
						element = element.trim();
						if(element.length > 0)
							this.controller.addCard(element);
					}.bind(this));
					
					//this.display(false);
					
					this.controller.draw();
				};
			}
			return vm;
		}());
		memorymaker.Card = (function (){
			
			function card (topleft, cardSize, contentstyle)
			{
				var factor = 4;
				var cardbasesize = cardSize.clone();
				cardbasesize.x -= 2*factor;
				cardbasesize.y -= 2*factor;
				
				var cardbasetl = topleft.clone();
				cardbasetl.x += factor; 
				cardbasetl.y += factor;
				
				
				this.groundContent = topleft.clone();
				this.groundMemory = topleft.clone();this.groundMemory.y +=cardSize.y /2;
				
				this.groundContentStyle = new CanvasKit.ContentStyle();
				this.groundContentStyle.fill = false;
				this.groundContentStyle.bordercolor = "lightgrey";
				
			   	this.tlcontent = cardbasetl.clone();
			   	this.tllabel = cardbasetl.clone(); this.tllabel.y = this.tllabel.y + cardSize.y /2;
				this.elementsize = cardSize.clone(); this.elementsize.y = cardSize.y /2;
				this.cardsize = cardbasesize.clone(); this.cardsize.y = (cardbasesize.y /2)-factor;
				
				this.contentMemory = new CanvasKit.ContentStyle();
				this.contentMemory.fill = false;
				this.contentMemory.text = "memory";
				
				this.baseContent =  new CanvasKit.Rectangle(this.groundContent, this.elementsize, this.groundContentStyle);
				this.baseMemory =  new CanvasKit.Rectangle(this.groundMemory, this.elementsize,this.groundContentStyle);
				
				this.rectContent =  new CanvasKit.Rectangle(this.tlcontent, this.cardsize, contentstyle);
				this.rectMemory =  new CanvasKit.Rectangle(this.tllabel, this.cardsize, this.contentMemory);
				
				
			}
			card.prototype = {
				
				render : function (canvas,ctxt)
				{
					this.baseContent.render(canvas,ctxt);
					this.baseMemory.render(canvas,ctxt);
					this.rectContent.render(canvas,ctxt);
					this.rectMemory.render(canvas,ctxt);
				}
			};
			
			
			return card;
			
		}());
		memorymaker.Cursor = ( function() {

				function cursor(columns, rows, elementsize) {
					this.currRow = 0;
					this.currCol = -1;
					this.rows = rows;
					this.columns = columns;
					this.elementsize = elementsize;

					this.next = function() {

						this.currCol += 1;
						if (this.currCol > this.columns - 1) {
							this.currCol = 0;
							this.currRow += 1;
						}

						return new CanvasKit.Point(this.currCol * this.elementsize.x, this.currRow * elementsize.y);

					};
				}

				return cursor;

			}());

		memorymaker.Controller = ( function() {

				function controller(canvas) {
					this.canvas = canvas;
					this.ctxt = canvas.getContext("2d");

					this.shapes = [];

				}


				controller.prototype = {

					setup : function(elementsize) {
						this.elementsize = elementsize;
						this.cursor = new memorymaker.Cursor(6, 100, this.elementsize);
					},
					addCard : function(txt) {
						var tl = this.cursor.next();
						var contentRect = new memorymaker.Card(tl, this.elementsize, this.contentstyle(txt));
						this.shapes.push(contentRect);
					},
					draw : function() {
						this.shapes.forEach(function(item) {
							item.render(this.canvas, this.ctxt);
						}.bind(this));
					},
					contentstyle : function(text) {
						var cs = new CanvasKit.ContentStyle();
						cs.fill = false;
						cs.text = text;
						return cs;
					},
					deleteContent: function ()
					{
						this.shapes = [];
						this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
					}
				};
				return controller;
			}());

		return memorymaker;
	}(window.memorymaker || {}));

