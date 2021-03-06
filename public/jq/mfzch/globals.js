// "constants"
var MAXBTFRAMES = [0, 0, 8, 7, 6, 5];
var MINBTFRAMES = [0, 0, 5, 4, 4, 3];
var MAXSKFRAMES = [0, 0, 6, 5, 4, 4];
var MINSKFRAMES = [0, 0, 4, 3, 3, 3];
var NUMSTATIONS = [0, 0, 3, 2, 2, 1];
var MEAND6D8 = [ // mean (highest of Xd6 + Yd8)
	[0, 4.5, 5.81, 6.47, 6.86],
	[3.5, 5.23, 6.09, 6.59, 6.92],
	[4.47, 5.59, 6.25, 6.67, 6.96],
	[4.96, 5.81, 6.35, 6.72, 6.99],
	[5.24, 5.95, 6.42, 6.76, 7.01],
	[5.43, 6.05, 6.48, 6.79, 7.03],
	[5.56, 6.12, 6.52, 6.81, 7.04]
]

var MAXCOMPANIES = 5;
var MAXTEAMS = 5;
var MAXFRAMES = 8;
var MAXSTATIONS = 3;
var MAXUNCLAIMEDSTATIONS = 1;
var MAXLOADOUTS = 10;
var MAXDOOMSDAY = 11;

var FRAMELOADS = [
	{
		type: 'h2h',
		title: 'Hand to Hand',
		subtitle: '(receives <span class="loadout inline"><span data-die="g8">G8</span></span>)',
		loadouts: [
			{
				name: "Swarmer",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>Like the name suggests, use these in swarms of four or more.  Gang up on a single target, each unit attacking and spotting for the next one in line. It relies on the higher damage rate of hand-to-hand&#8212;4 or better on the damage roll as opposed to 5 or 6, depending on cover, for ranged weapons&#8212;and successive Spots to chew through individual frames in the opposing force.",
				rh: 2,
				b: 1,
				y: 1
			},
			{
				name: "Close Combat",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>The hand-to-hand variant of the Soldier. A highly versatile and reliable unit. It can close quickly and deliver a strong attack without sacrificing its ability to defend or spot. Remains tactically useful as it takes damage.",
				rh: 1,
				b: 1,
				y: 1,
				g: 1
			},
			{
				name: "Mini-soldier",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>With the free Green d8, this frame still rolls a die in each color even though it&#8217;s not carrying a full compliment of systems. This allows full versatility while underbidding.",
				rh: 1,
				b: 1,
				y: 1
			},
			{
				name: "Brawler",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>This frame has the speed to get to enemy stations, the power to force defenders off them, and the toughness to stay on them until the job is done. Excellent for station-grabbing.",
				rh: 2,
				b: 2
			},
			{
				name: "Pike",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>A good frame to consider if underbidding offensively. Retains maneuverability with the free Green d8, but hits reasonably well because of the improved hand-to-hand damage ratio and can keep up a good defense.",
				rh: 1,
				b: 2
			},
			{
				name: "Close Assault",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>This frame has the highest damage potential of any loadout and good speed to be able to close in and put it to work. Added defense makes this unit less susceptible to damage, but the lack of spotting means other frames will need to work together with this one to get the most from it.",
				rh: 2,
				b: 1,
				g: 1
			},
			{
				name: "Chaser",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>An extremely hard hitting and maneuverable frame. When there&#8217;s a lot of distance to cover, this frame can reliably cross it and outrunning this unit is nearly impossible. Get a spot out ahead of it for some major damage, but watch out for a low defense which can only be assigned from its whites.",
				rh: 2,
				g: 2
			}
		]
	},
	{
		type: 'dfire',
		title: 'Direct Fire',
		subtitle: '',
		loadouts: [
			{
				name: "Squad Leader",
				description: "This frame is designed to augment a squad of Soldiers. It can spot for a detached unit, or even take over spotting for a bunch of frames that have dropped their Spotting to damage. It&#8217;s a fighty Spotting frame.",
				rd: 1,
				b: 1,
				y: 2
			},
			{
				name: "Hammer",
				description: "The Hammer and Anvil work as a team. The Hammer drives the opponent before it placing spots for the more heavily armed Anvil.",
				rd: 1,
				b: 2,
				y: 1
			},
			{
				name: "Anvil",
				description: "The Hammer and Anvil work as a team. The Hammer drives the opponent before it placing spots for the more heavily armed Anvil.",
				rd: 2,
				b: 1,
				y: 1
			},
			{
				name: "Soldier",
				description: "This is the design with the most basic loadout. It does everything, but nothing exceptional. These should be filler units in your army as they can adapt to changing tactical situations better than other specialized units.",
				rd: 1,
				b: 1,
				y: 1,
				g: 1
			},
			{
				name: "Tank",
				description: "It&#8217;s not particularly fast but, it takes a beating and dishes one out. It fills the role of a line trooper, neither the specialist nor a leader. This guy holds the middle of the field, slowly moving forward while preventing any of your opponent&#8217;s troops from getting closer to your Station.",
				rd: 2,
				b: 2
			},
			{
				name: "Heavy Assault",
				description: "Designed to follow the Closer into battle. Carrying double Direct Fire to improve its chances of hitting, while using Movement and Defense to improve survivability.",
				rd: 2,
				b: 1,
				g: 1
			},
			{
				name: "Cover Buster",
				description: "Rather than targeting enemy frames, the cover buster is used as support to target the enemy&#8217;s cover directly. After ripping the cover apart, its white dice become available for spotting the frame that was using it. Though it clears out cover that might have later been used against the enemy, the frame itself becomes usable as movable cover.</p><p>Optionally, a green system can be added to improve maneuverability and soak up damage.",
				rd: 1,
				b: 2
			},
			{
				name: "Fast Assault",
				description: "A quick moving version of the Assault archetype.  It should be used in a manner similar to the Swarmer.",
				rd: 1,
				b: 1,
				g: 2
			},
			{
				name: "Assault",
				description: "A front-line, standard combat frame. It can take 25% less damage than the Soldier as it has one less attachment.",
				rd: 1,
				b: 1,
				g: 2
			},
			{
				name: "Shoot &#38; Scoot",
				description: "Carries the weaponry the Moving Wall cannot. Hit and run. Shoot fast, shoot hard, and run from cover to cover. AKA: Mobile Gun.",
				rd: 2,
				g: 2
			}
		]
	},
	{
		type: 'arty',
		title: 'Artillery',
		subtitle: '',
		loadouts: [
			{
				name: "Recon-by-Fire",
				description: "This design can reach out and touch most of the table. Camp it out in a shooting blind at the beginning of the game and start wreaking havoc. Because of its reach and poor defense, it can often become an early target.",
				ra: 2,
				y: 2
			},
			{
				name: "Delegator",
				description: "Influence the flow of battle from a distance. This frame can be activated early to force another player to take their turn in a different order than they may have planned. Then, follow up with a large spot to set up a good target for you or anyone else. Use it to defuse spot chaining against your forward units if possible, or to force enemy artillery to go before they have the pick of the field and whatever spots are left on it.",
				ra: 1,
				b: 1,
				y: 2
			},
			{
				name: "Binary",
				description: "The Artillery version of the Soldier.  This frame works best in pairs. Stage each frame (Direct Fire +1) units apart from each other. This allows each frame to spot for the other as they work their way through the battle field.",
				ra: 1,
				b: 1,
				y: 1,
				g: 1
			},
			{
				name: "Artillerist",
				description: "It doesn&#8217;t move fast and it doesn&#8217;t have to. The only time you&#8217;ll really move this frame is at the start of the game when it hunkers down behind some cover in a nice shooting position. You&#8217;ll use its White dice for Defense or Offense, maybe a little of both depending on the situation. When you get good rolls from your primary Red and Blue dice you can toss a Spot on an opponent&#8217;s frame that&#8217;s out in the open. You&#8217;ll want a spotter for this one, to get those really high attack rolls.",
				ra: 2,
				b: 2
			},
			{
				name: "Sniper",
				description: "Take it up on top of the nearest piece of terrain to rain shots onto the battlefield. It moves around to get the best use of cover and range. It also has an open slot to use however you see fit for the coming battle.",
				ra: 1,
				b: 1,
				g: 1
			},
			{
				name: "Stalker",
				description: "This frame stays on the outskirts of the battlefield, shelling vulnerable targets or ganging up with everyone else. Meanwhile, you&#8217;re using that movement die to threaten undefended stations, and to keep out of range of enemy units. In the end stages of the game, don&#8217;t be afraid to let them under your guns if it means grabbing a station.</p><p>The Stalker can be loaded with an additional system. On smaller fields a spotting system can be useful for taking out closing enemy units. On larger fields an additional movement system can make it good for station grabbing or staying out of range and in cover. Additional defense is always a safe option.",
				ra: 2,
				g: 1
			}
		]
	},
	{
		type: 'mixed',
		title: 'Mixed Range',
		subtitle: '',
		loadouts: [
			{
				name: "Closer",
				description: "This is the first frame you place if you&#8217;re the Primary Attacker. It starts outside the Defender&#8217;s perimeter and rushes in to take an Objective. It has enough armor to survive for a little while and the Direct Fire Weapon can be ditched to soak damage as well. After the DF Weapon is ditched it gains a Green d8 for movement which allows it to close at high speed and use the two hand-to-hand Weapons.",
				rd: 1,
				rh: 2,
				b: 1
			},
			{
				name: "Charger",
				description: "Like many other designs in MFZ, this is a front line combatant. Tactically you use this frame like the Closer, ditching systems as you take damage while making your way to your opponent&#8217;s Station. Unlike the Closer, you can ditch the systems in the order you want&#8212;rather than in the specific order dictated for the Closer.",
				rd: 1,
				rh: 1,
				b: 1,
				g: 1
			}
		]
	},
	{
		type: 'support',
		title: 'Support',
		subtitle: '(receives <span class="loadout inline"><span data-die="g8">G8</span></span>)',
		loadouts: [
			{
				name: "Armored Spotter",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>This guy has one role; putting those big juicy yellows on the most opportune targets the opponent has. The Blue die enhances survivability. Even still, keep this guy in cover, it has no weapons.",
				b: 1,
				y: 2
			},
			{
				name: "Watchtower",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>This is a multipurpose design. It can be cover and spotter for artillery. It can also be fast moving cover so hand-to-hand specialists can move up in areas with sparse cover. When the two defense dice get blown it can still run around spotting. Or, if you need cover more than spot, it can lose several systems and still be good cover.",
				b: 2,
				y: 2
			},
			{
				name: "Scout",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>This frame may not look threatening, but it can provide multiple useful support roles. In the thick of battle it can be staged as cover itself. High maneuverability allows it to keep up with the force it assists. It keeps a spotting ability so following units can hit harder. It can be used for station grabbing as its high defense allows it to stay in place longer. Finally, with systems in all three non-attack categories, both white dice are often freed for hand-to-hand operations.",
				b: 2,
				y: 1,
				g: 1
			},
			{
				name: "Recon",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>An underwhelming unit by looks, this frame has the effect of making other frames lethal while staying safely out of the thick of things. Low defense makes it easy to hit, but its threat is only indirect. Extreme maneuverability makes this unit usable for station capture.",
				y: 2,
				g: 2
			},
			{
				name: "Moving Wall",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>Walking cover. Could possibly sprint into hand-to-hand range and fight using White dice.",
				b: 2,
				g: 1
			},
			{
				name: "Tackle",
				description: "<span class=\"loadout\"><span data-die=\"g8\">G8</span></span>Similar to the moving wall but with even stronger movement. Use as cover initially and when the time is right, sprint for a station capture while your main forces concentrate on a new objective.",
				b: 2,
				g: 2
			}
		]
	},
	{
		type: 'ssr',
		title: 'SSR-based',
		subtitle: '(uses <span class="loadout inline"><span data-sys="ssr">SSR</span></span>)',
		loadouts: [
			{
				name: "Improved Soldier",
				description: "<ul class=\"sys-display in-list\"><span data-sys=\"ssr\">SSR</span></ul >With the addition of one SSR, the Soldier now has an upgraded punch.",
				rd: 1,
				b: 1,
				y: 1,
				g: 1,
				ssr: 1
			},
			{
				name: "Super Soldier",
				description: "<ul class=\"sys-display in-list\"><span data-sys=\"ssr\">SSR</span><span data-sys=\"ssr\">SSR</span></ul> The Super Soldier should be a frontline striker, using its two SSRs on opposing frames with big, juicy Spot numbers.",
				rd: 1,
				b: 1,
				y: 1,
				g: 1,
				ssr: 2
			},
			{
				name: "Mega Soldier",
				description: "<ul class=\"sys-display in-list\"><span data-sys=\"ssr\">SSR</span><span data-sys=\"ssr\">SSR</span><span data-sys=\"ssr\">SSR</span></ul> You can use the Mega-Soldier&#8217;s three SSRs one at a time to give it an extended punch. Or, you can use them all at once to make sure that dangerous opposing frame gets hit hard and stays down.",
				rd: 1,
				b: 1,
				y: 1,
				g: 1,
				ssr: 3
			},
			{
				name: "Missile Monkey",
				description: "<ul class=\"sys-display in-list\"><span data-sys=\"ssr\">SSR</span><span data-sys=\"ssr\">SSR</span><span data-die=\"g8\">G8</span></ul> Single Shot Rockets on an otherwise un-armed frame doesn&#8217;t negate the free Green d8 for having no ranged weapons. So upgrade the Armored Spotter with a handful of SSRs then go to town! Keep this guy in cover and use a SSR if an opponent gets too close. Otherwise, use the double Yellows to light up targets for your heavy hitters.",
				b: 1,
				y: 2,
				ssr: 2
			}
		]
	}
];
