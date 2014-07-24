var memorymaker = window.memorymaker || {}; ( function(memorymaker) {



		memorymaker.VM = (function (){
			
			function vm (canvashost)
			{
				this.display = ko.observable(true);
				this.words = ko.observable();
				this.canvashost = canvashost;
				this.canvas = null;
				this.ctxt = null;
				this.controller = new memorymaker.Controller(this);
				this.controller.setup(new CanvasKit.Point(150,150));
				this.deleteContent = function ()
				{
					this.controller.deleteContent();
				};
				this.loadAndDisplay = function ()
				{
					this.controller.deleteContent();
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
				
				this.create = function (size)
				{
					    var canv = document.createElement('canvas'); // creates new canvas element
					    canv.id = 'canvas'; // gives canvas id
					    canv.height = size.y; //get original canvas height
					    canv.width = size.x; // get original canvas width
					    document.getElementById(this.canvashost).appendChild(canv);
					    
					    this.canvas = canv;
					    this.ctxt = this.canvas.getContext('2d');
				};
				this.dispose = function ()
				{
					if(this.canvas !== null){
						 document.getElementById(this.canvashost).removeChild(document.getElementById("canvas"));
						 this.canvas = null;
						 this.ctxt = null;
					}
					
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
				
				this.groundContentStyle = new CanvasKit.ContentStyle();
				this.groundContentStyle.fill = false;
				this.groundContentStyle.bordercolor = "lightgrey";
				
				
			   	this.tlcontent = cardbasetl.clone();
				this.elementsize = cardSize.clone();
				this.cardsize = cardbasesize.clone(); 
				
				
				this.baseContent =  new CanvasKit.Rectangle(this.groundContent, this.elementsize, this.groundContentStyle);
				
				this.rectContent =  new CanvasKit.Rectangle(this.tlcontent, this.cardsize, contentstyle);
				
				
			}
			card.prototype = {
				
				render : function (canvas,ctxt)
				{
					this.baseContent.render(canvas,ctxt);
					this.rectContent.render(canvas,ctxt);
				}
			};
			
			
			return card;
			
		}());
		memorymaker.DoubleCard = (function (){
			
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
				this.contentMemory.textangle = 45;
				
				
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
							if(this.currRow % 6 == 0) this.currRow +=1;
							
						}

						return new CanvasKit.Point(this.currCol * this.elementsize.x, this.currRow * elementsize.y);

					};
					
					this.getCurrentColumnCount = function ()
					{
						return this.columns;
					};
					this.getCurrentRowCount = function ()
					{
						return this.currRow+1;
					};
				}

				return cursor;

			}());

		memorymaker.Controller = ( function() {

				function controller(canvasmanager) {
					
					this.canvasmanager = canvasmanager;
					this.shapes = [];

				}


				controller.prototype = {

					setup : function(elementsize) {
						this.elementsize = elementsize;
						this.cursor = new memorymaker.Cursor(4, 100, this.elementsize);
					},
					addCard : function(txt) {
						var tl = this.cursor.next();
						var contentRect = new memorymaker.Card(tl, this.elementsize, this.contentstyle(txt));
						this.shapes.push(contentRect);
					},
					draw : function() {
						this.canvasmanager.create(this.calcDimentions());
						
						this.shapes.forEach(function(item) {
							item.render(this.canvasmanager.canvas, this.canvasmanager.ctxt);
						}.bind(this));
					},
					contentstyle : function(text) {
						var cs = new CanvasKit.ContentStyle();
						cs.fill = false;
						cs.text = text;
						cs.textangle = 45;
						cs.textsize = -1;
						return cs;
					},
					deleteContent: function ()
					{
						this.shapes = [];
						this.canvasmanager.dispose();
						this.cursor = new memorymaker.Cursor(4, 1000, this.elementsize);
						//this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
					},
					calcDimentions: function ()
					{
						var margin = 50;
						var cols = this.cursor.getCurrentColumnCount();
						var rows = this.cursor.getCurrentRowCount();
						
						return new CanvasKit.Point(cols*this.elementsize.x+margin,rows*this.elementsize.y+margin);
					}
				};
				return controller;
			}());

		return memorymaker;
	}(window.memorymaker || {}));

