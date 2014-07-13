var memorymaker = window.memorymaker || {}; ( function(memorymaker) {


		memorymaker.Card = (function (){
			
			function card (topleft, cardSize, contentstyle)
			{
			   	this.tlcontent = topleft.clone();
			   	this.tllabel = topleft.clone(); this.tllabel.y = this.tllabel.y + cardSize.y /2;
				this.elementsize = cardSize.clone(); this.elementsize.y = cardSize.y /2;
				this.contentMemory = new CanvasKit.ContentStyle();
				this.contentMemory.fill = false;
				this.contentMemory.text = "memory";
				
				this.rectContent =  new CanvasKit.Rectangle(this.tlcontent, this.elementsize, contentstyle);
				this.rectMemory =  new CanvasKit.Rectangle(this.tllabel, this.elementsize, this.contentMemory);
				
				
			}
			card.prototype = {
				
				render : function (canvas,ctxt)
				{
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
					}
				};
				return controller;
			}());

		return memorymaker;
	}(window.memorymaker || {}));

