import zim from "https://zimjs.org/cdn/01/zim";

// see https://zimjs.com
// and https://zimjs.com/learn
// and https://zimjs.com/docs

new Frame(FIT, window.innerWidth, window.innerHeight, "black", "black", ready, "/assets/people.png");
function ready() {
   
	// given F (Frame), S (Stage), W (width), H (height)
    // put your code here
	
	const cols = 15;
	const rows = 7;
	
	// make a list of Sprite frames
	const order = [];
	loop(cols*rows, i=>{order.push(i)});	
	
	// randomize the list and loop 
	loop(shuffle(order), i=>{
		const speed = rand(20,40);		
		new Sprite("/assets/people.png", cols, rows)
			.run({startFrame:i, endFrame:i})	
			.pos(-400,-180+i*1.3,LEFT,BOTTOM)
			.animate({
				props:{y:String(rand(-5,-10))}, // string values are relative amounts
				time:speed/100,
				rewind:true,
				loop:true,
				ease:"quadIn"
			})				
			.animate({
				props:{x:W+400, flip:true},
				time:speed,
				loop:true,				
				rewind:true,
				ease:"linear"
			})
			.percentComplete = rand(100);
	});
	
} // end ready

// Docs for items used:
// https://zimjs.com/docs.html?item=Frame
// https://zimjs.com/docs.html?item=Sprite
// https://zimjs.com/docs.html?item=animate
// https://zimjs.com/docs.html?item=loop
// https://zimjs.com/docs.html?item=pos
// https://zimjs.com/docs.html?item=rand
