// Lessons: 文 literature → 技 technique → 稽古 exercise.
// Literature is summarised in our own words with the source named, so you can find the book.
// Ancient texts (Cicero, Ad Herennium, Quintilian) are quoted in our own translation.

export const LEVELS = [
  { n: 1, k: '初', name: 'Foundations', sub: 'Attention, pictures, links, your first palace' },
  { n: 2, k: '基', name: 'Core systems', sub: 'Major, Dominic, names, dates, cards' },
  { n: 3, k: '上', name: 'Advanced systems', sub: 'PAO, binary, 3-digit, images, spoken' },
  { n: 4, k: '速', name: 'Speed & volume', sub: 'Deliberate practice, sprints, long events' },
  { n: 5, k: '達', name: 'Competition ready', sub: 'Rules, strategy, full mock championship' },
];

export const LESSONS = [
// ═══════════════════════ LEVEL 1 · 初 FOUNDATIONS ═══════════════════════
{
  id: 'l1-attention', level: 1, title: 'Attention: the first gate',
  lit: {
    book: 'The Memory Book', author: 'Harry Lorayne & Jerry Lucas', year: 1974,
    body: 'Lorayne and Lucas argue that most "forgetting" is really failing to notice. You cannot remember something you never registered in the first place. They call the fix original awareness: deliberately paying attention at the moment of learning. Nelson Dellis, four-time USA Memory Champion, makes the same point in Remember It! (2018) with his SEE principle: engage the Senses, Exaggerate, and Energize the image with movement. Psychology adds the von Restorff (isolation) effect, published in 1933: an item that stands out from its neighbours is remembered far better.',
  },
  tech: {
    intro: 'Before any system, train the habit of deliberate noticing. Every item you memorise should get one second of full attention and a vivid sensory picture.',
    steps: ['Read the item and say it once in your head.', 'See it: give it a colour, a size and a texture.', 'Exaggerate it: make it huge, tiny, or many.', 'Energize it: make it move, make a noise, smell or feel.', 'Move on. Do not reread.'],
    example: 'Word: "ladder". Do not just read it. See a 50-metre bamboo ladder, creaking, splinters under your palms, a smell of wet wood.',
    visual: 'see',
    tips: ['Speed comes later. In Level 1, quality of image beats speed.', 'If an image feels flat, add one more sense.'],
  },
  ex: { trainer: 'words', cfg: { count: 10, memo: 120, recall: 180 }, task: 'Memorise 10 words in order. Use SEE on every word.', target: 8 },
},
{
  id: 'l1-visual', level: 1, title: 'Think in pictures',
  lit: {
    book: 'Imagery and Verbal Processes', author: 'Allan Paivio', year: 1971,
    body: 'Paivio\'s dual-coding theory proposes that the mind stores information in two linked codes: verbal and visual. Concrete words like "elephant" get both codes and are remembered better than abstract words like "justice", which mostly get one. This is the scientific root of the picture-superiority effect that every memory athlete exploits. Japan has its own living example: children trained in soroban (abacus) learn anzan, mental calculation on an imagined abacus, turning numbers into a picture they can see and move.',
  },
  tech: {
    intro: 'Your job is to turn everything into a picture. Concrete words are easy; abstract words need a stand-in image.',
    steps: ['For a concrete word, see the object itself.', 'For an abstract word, pick a symbol: "justice" → a judge\'s gavel; "freedom" → a bird leaving a cage.', 'For a sound-alike, use the sound: "patience" → "patients" in a hospital bed.', 'Hold each picture for one breath, then move on.'],
    example: '"Victory" → a gold medal swinging on a ribbon. "Silence" → a finger on lips. "Karachi" → the sea at Clifton with camels on the beach.',
    visual: 'see',
    tips: ['Choose the first picture that comes. The first one is usually the strongest.', 'Re-use the same symbol every time for the same abstract word.'],
  },
  ex: { trainer: 'words', cfg: { count: 12, memo: 120, recall: 180, abstract: 0.3 }, task: 'Memorise 12 words, some abstract. Turn each into one clear picture.', target: 9 },
},
{
  id: 'l1-link', level: 1, title: 'The link method',
  lit: {
    book: 'The Memory Book', author: 'Harry Lorayne & Jerry Lucas', year: 1974,
    body: 'The link system is the first technique Lorayne and Lucas teach. You connect each item to the next with a ridiculous picture, so that recalling one item pulls the next one out of your memory, like the next carriage of a train. They stress that the picture must be illogical and full of action. Two objects politely standing next to each other will be forgotten; one object crashing into, eating or replacing the other will not.',
  },
  tech: {
    intro: 'Link item 1 to item 2, then 2 to 3, and so on. Each picture contains only two items.',
    steps: ['Make a vivid picture of item 1.', 'Make item 1 interact violently or absurdly with item 2.', 'Forget item 1. Now link item 2 with item 3.', 'To recall, start from item 1 and let each picture lead to the next.'],
    example: 'kite → apple → shoe: a kite slices an apple in half in mid-air; the apple halves are stuffed into a shoe that starts chewing them.',
    visual: 'chain',
    tips: ['Weakness: break one link and you lose the rest. The memory palace (lesson 5) fixes this.'],
  },
  ex: { trainer: 'words', cfg: { count: 15, memo: 180, recall: 240 }, task: 'Link 15 words into one chain, then recall them in order.', target: 12 },
},
{
  id: 'l1-story', level: 1, title: 'The story method',
  lit: {
    book: 'Narrative stories as mediators for serial learning (Psychonomic Science)', author: 'Gordon Bower & Michal Clark', year: 1969,
    body: 'In this classic experiment, students learned 12 lists of 10 words each. One group wove each list into a short story; the control group studied normally. When tested on all 12 lists at the end, the story group recalled around 93% of the words, the control group around 13%. A story adds meaning, cause and effect, which makes a chain of links much stronger.',
  },
  tech: {
    intro: 'A story is a link chain with a plot. Each item does something that causes the next event.',
    steps: ['Make yourself the hero of the story.', 'Introduce the items in order as characters or objects.', 'Give each event a cause: because the kite cut the apple, the shoe got hungry.', 'Retell the story quickly once before recall.'],
    example: 'You fly a kite over Seaview; it slices an apple; the juice wakes a shoe that runs off to the market and buys a drum…',
    visual: 'chain',
    tips: ['Stories are excellent for short lists (shopping, speech points). For competition volumes you will need palaces.'],
  },
  ex: { trainer: 'words', cfg: { count: 20, memo: 240, recall: 300 }, task: 'Memorise 20 words with one continuous story.', target: 16 },
},
{
  id: 'l1-palace', level: 1, title: 'The memory palace',
  lit: {
    book: 'De Oratore, Book II, 86–88', author: 'Cicero', year: '55 BCE',
    body: 'Cicero tells the founding story of the art. The poet Simonides of Ceos left a banquet hall moments before its roof collapsed. The bodies were crushed beyond recognition, but Simonides could name every guest by remembering where each one had been sitting. Cicero draws the lesson that order is the key to memory: choose places, put images of the things you want to remember in those places, and the order of the places will preserve the order of the things.',
    quote: { text: 'The order of the places preserves the order of the things, and the images of the things stand for the things themselves; we use the places as a wax tablet and the images as the letters written on it.', note: 'Cicero, De Oratore II.86, our translation' },
  },
  tech: {
    intro: 'A memory palace (method of loci) is a route through a place you know well. Each stop on the route (a locus) holds one image.',
    steps: ['Pick a place you know very well: your home, school, office or a street.', 'Walk it in your mind in a fixed direction and choose 10 distinct stops: door, shoe rack, sofa, TV, window…', 'Write the stops down in the Palaces tab (宮).', 'To memorise, place one image on each stop, interacting with it.', 'To recall, walk the route again and look at each stop.'],
    example: 'Stop 1, front door: a giant kite is jammed in the door. Stop 2, shoe rack: apples rolling out of every shoe.',
    visual: 'loci',
    tips: ['Every top memory athlete uses this method. A 2017 study in Neuron (Dresler et al.) found that six weeks of loci training more than doubled recall in ordinary people.'],
  },
  ex: { trainer: 'palace', cfg: { loci: 10 }, task: 'Build your first palace with at least 10 stops in the Palaces tab, then memorise 10 words in it.', target: 10, then: { trainer: 'words', cfg: { count: 10, memo: 120, recall: 180 } } },
},
{
  id: 'l1-loci', level: 1, title: 'Rules for good places',
  lit: {
    book: 'Rhetorica ad Herennium, Book III', author: 'Unknown Roman author', year: 'c. 85 BCE',
    body: 'The oldest surviving manual of the art gives precise rules for places. Choose places in quiet, little-frequented buildings, because crowds of passers-by blur the images. Make each place different from the others, so they cannot be confused. Places should be of moderate size and moderately lit: too bright dazzles, too dark hides. They should be about thirty feet apart. And the author recommends marking every fifth place, for example with a golden hand, so you always know where you are in the series.',
  },
  tech: {
    intro: 'Good loci are distinct, well spaced and easy to "see". Bad loci (ten identical chairs) cause mix-ups.',
    steps: ['Make every stop visually different from its neighbours.', 'Keep a steady distance between stops: a few steps, not across a whole room and not touching.', 'Mark every 5th stop with something gold or special, and every 10th with a number.', 'Walk your palace twice, fast, until you can list the stops forwards and backwards.'],
    example: 'Bad: chair 1, chair 2, chair 3. Good: chair, bookshelf, window ledge, plant pot, ★ golden clock (5th).',
    visual: 'loci',
    tips: ['Avoid stops that look alike (two doors, two beds).', 'Places outside your home work too: your street, a mosque courtyard, a cricket ground.'],
  },
  ex: { trainer: 'words', cfg: { count: 20, memo: 300, recall: 300 }, task: 'Extend your palace to 20 stops if needed, then memorise 20 words in it.', target: 17 },
},
{
  id: 'l1-images', level: 1, title: 'Striking images',
  lit: {
    book: 'Rhetorica ad Herennium, Book III', author: 'Unknown Roman author', year: 'c. 85 BCE',
    body: 'The same manual explains why some images stick. We forget ordinary, everyday things, but we remember the strange, the shocking, the funny and the beautiful. So the images we place should be active (imagines agentes): figures of exceptional beauty or ugliness, dressed in crowns or purple cloaks, stained with blood or mud, or comic. Two thousand years later, memory athletes follow the same advice.',
    quote: { text: 'When we see in everyday life things that are petty, ordinary and banal, we generally fail to remember them… but if we see or hear something exceptionally base, dishonourable, unusual, great, unbelievable or laughable, that we are likely to remember for a long time.', note: 'Ad Herennium III.35, our translation' },
  },
  tech: {
    intro: 'Make every image do something extreme. Size, action, emotion, humour.',
    steps: ['Scale: make it enormous or microscopic.', 'Action: it explodes, melts, dances, attacks.', 'Emotion: disgust, fear, delight, embarrassment.', 'Interaction: the image must touch the locus. A banana resting on the sofa is weak; a banana sliming the sofa cushions is strong.'],
    example: 'Locus: kitchen tap. Word: "telescope". The tap sprays a jet of water so strong it launches a telescope through the ceiling.',
    visual: 'see',
    tips: ['If you notice yourself "just placing" an object, stop and add action.'],
  },
  ex: { trainer: 'words', cfg: { count: 25, memo: 300, recall: 300, abstract: 0.2 }, task: 'Memorise 25 words in your palace. Every image must move.', target: 20 },
},
{
  id: 'l1-pegs', level: 1, title: 'Body pegs and number pegs',
  lit: {
    book: 'The Memory Book', author: 'Harry Lorayne & Jerry Lucas', year: 1974,
    body: 'Peg systems give each number a fixed image, a "peg" you can hang new information on. Unlike a link chain, pegs let you jump straight to item 7 without going through 1 to 6. Lorayne and Lucas build their pegs from the phonetic code you will learn in Level 2. Simpler pegs use rhymes (one-sun, two-shoe) or shapes (1 = pencil, 2 = swan). The body list, ten fixed points from your feet to the top of your head, is a peg list you carry everywhere.',
  },
  tech: {
    intro: 'Learn a 10-item body list and a 10-item shape list. Use them for short lists you need by number.',
    steps: ['Body list: 1 feet, 2 knees, 3 thighs, 4 hips, 5 belly, 6 chest, 7 shoulders, 8 neck, 9 face, 10 top of head.', 'Shape list: 0 ball, 1 pencil, 2 swan, 3 handcuffs, 4 sailboat, 5 hook, 6 cherry, 7 cliff, 8 snowman, 9 balloon on a stick.', 'Attach item 1 to peg 1 with a vivid interaction, and so on.', 'To recall item 7, go straight to peg 7.'],
    example: 'Item 7 = "umbrella" on body peg 7 (shoulders): an umbrella opens out of each shoulder like wings.',
    visual: 'pegs',
    tips: ['Pegs are fast to reuse because there are only ten. Old images fade within a day.'],
  },
  ex: { trainer: 'words', cfg: { count: 10, memo: 120, recall: 180, peg: true }, task: 'Hang 10 words on your body pegs. You will be asked for them out of order.', target: 9 },
},
{
  id: 'l1-review', level: 1, title: 'Review, retrieval and spacing',
  lit: {
    book: 'Über das Gedächtnis (Memory)', author: 'Hermann Ebbinghaus', year: 1885,
    body: 'Testing himself on nonsense syllables, Ebbinghaus drew the first forgetting curve: memory drops steeply within hours, then levels off. He also found that relearning is faster each time, and that spreading repetitions over days works better than cramming. Modern research summarised in Make It Stick (Brown, Roediger & McDaniel, 2014) adds that actively recalling (testing yourself) strengthens memory more than rereading. Hafiz students who memorise the Qur\'an use a similar structure: sabaq (the new lesson), sabqi (recent lessons) and manzil (older portions), reviewed in rotation.',
  },
  tech: {
    intro: 'For the systems you build (your number and card images), use spaced retrieval: test yourself, then wait longer each time.',
    steps: ['After learning something, test yourself the same day.', 'Test again after 1 day, then 3 days, then 1 week, then 2 weeks.', 'Always recall first, then check. Never just reread.', 'In this app, the Systems tab (型) schedules your flashcards like this automatically.'],
    example: 'Sabaq: today\'s 10 new number images. Sabqi: the last week\'s images. Manzil: all 100, once a week.',
    visual: 'curve',
    tips: ['For competition, the opposite is true for palaces: you want old images to fade, so you can reuse the palace.'],
  },
  ex: { trainer: 'words', cfg: { count: 15, memo: 180, recall: 240, delay: 120 }, task: 'Memorise 15 words, then do 2 minutes of mental arithmetic before recall.', target: 12 },
},

// ═══════════════════════ LEVEL 2 · 基 CORE SYSTEMS ═══════════════════════
{
  id: 'l2-major', level: 2, title: 'The Major system',
  lit: {
    book: 'Memoria Technica', author: 'Richard Grey', year: 1730,
    body: 'Turning digits into letters is an old idea. Stanislaus Mink von Wennsshein (around 1648) and Richard Grey\'s Memoria Technica (1730) coded numbers as letters to memorise historical dates. In 1825 Aimé Paris refined it into the consonant-sound code used today as the Major system. India had a strikingly similar idea much earlier: the Sanskrit Kaṭapayādi system assigns consonants to digits, so numbers can be hidden inside words and verses. Kerala astronomers used it, and Carnatic music uses it to number its 72 melakarta rāgas.',
  },
  tech: {
    intro: 'Each digit is a consonant sound. Vowels are free. Add vowels to make a picture-word.',
    steps: ['Learn the code: 0 s/z, 1 t/d, 2 n, 3 m, 4 r, 5 l, 6 j/sh/ch, 7 k/g, 8 f/v, 9 p/b.', 'Memory hooks: 1 has one downstroke (t), 2 two (n), 3 three (m), 4 ends in R, 5 is L in Roman 50, 6 looks like a reversed J, 7 is like a K made of two 7s, 8 is like a written f, 9 is a mirrored P, 0 is s for "zero".', 'Make words: 12 = t-n = "tin", 41 = r-t = "rat", 94 = p-r = "pear".', 'Only sounds count, not spelling: "knee" = n = 2.'],
    example: '3.1415 → 3 = "ma" (mother), 14 = "tyre", 15 = "doll": your mother rolls a tyre over a doll.',
    visual: 'major',
    tips: ['You can use Urdu or any language for the words, as long as you are consistent.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 20, memo: 120, recall: 180 }, task: 'Memorise 20 digits using Major words in your palace.', target: 16 },
},
{
  id: 'l2-build', level: 2, title: 'Build your 00–99',
  lit: {
    book: 'Moonwalking with Einstein', author: 'Joshua Foer', year: 2011,
    body: 'Foer, a journalist who went on to win the 2006 USA Memory Championship, describes how competitors prepare their images long before the contest. Each two-digit number gets a fixed, pre-learned image, so that during an event there is no thinking, only seeing. Anders Ericsson\'s research (Peak, 2016) calls these pre-built structures mental representations: the expert does not work harder in the moment, they have better ready-made patterns.',
  },
  tech: {
    intro: 'Create one fixed image for every number 00 to 99. This is the single most important piece of preparation.',
    steps: ['Open Systems → 00–99 (型). The Major word suggestions are a starting point.', 'For each number choose a vivid, unique image: ideally a person or animal for richer action.', 'Avoid two images that look alike (cat/tiger, Rolex/clock).', 'Fill at least 30 today, all 100 within a week.'],
    example: '07 = "sock" → a smelly red sock. 41 = "rat". 52 = "lion". 86 = "fish".',
    visual: 'major',
    tips: ['People you know (family, cricketers, singers) make the most memorable images.', 'Your list will change. Replace any image that feels weak.'],
  },
  ex: { trainer: 'system', cfg: { system: 'n2', min: 30 }, task: 'Enter at least 30 images in your 00–99 system.', target: 30 },
},
{
  id: 'l2-flash', level: 2, title: 'Make your images instant',
  lit: {
    book: 'Make It Stick', author: 'Peter C. Brown, Henry Roediger & Mark McDaniel', year: 2014,
    body: 'The authors call effortful recall a "desirable difficulty": struggling to retrieve something makes it stick better than easy rereading. For memory athletes this means drilling the image list until seeing "52" produces the lion instantly, with no translation step. Top competitors report seeing images faster than a second per pair of digits; the Memory League format, with only one minute to memorise, rewards exactly this.',
  },
  tech: {
    intro: 'Drill number → image until the image appears without thinking.',
    steps: ['Start a flashcard drill in Systems.', 'See a number, picture the image immediately, then tap reveal.', 'Mark "got it" only if the image came within about 2 seconds.', 'Repeat daily. The app spaces cards you know well.'],
    example: 'Card shows 86. You see the fish before tapping. Tap → "fish" → ✓.',
    visual: 'flash',
    tips: ['Speed of image retrieval is your ceiling for every numbers discipline.'],
  },
  ex: { trainer: 'flash', cfg: { system: 'n2', count: 30 }, task: 'Do a 30-card drill of your number images. Aim for 90% instant recalls.', target: 27 },
},
{
  id: 'l2-dominic', level: 2, title: 'The Dominic system',
  lit: {
    book: 'How to Develop a Perfect Memory', author: 'Dominic O\'Brien', year: 1993,
    body: 'O\'Brien, eight-time World Memory Champion, describes his own system. Each digit becomes a letter (1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O), and every pair of digits becomes a person with those initials: 15 = A.E. = Albert Einstein, 07 = O.G. Each person comes with a characteristic action. Because people are naturally full of emotion and movement, they make strong images, and splitting person and action lets you combine two pairs in one scene.',
  },
  tech: {
    intro: 'An alternative to Major for 00–99: every pair is a person with matching initials.',
    steps: ['Learn the letters: 1 A, 2 B, 3 C, 4 D, 5 E, 6 S, 7 G, 8 H, 9 N, 0 O.', 'Find a person for each pair: 13 = A.C., 66 = S.S., 10 = A.O.', 'Give each person a signature action: a cricketer bowling, a singer singing.', 'Four digits = person of the first pair doing the action of the second pair.'],
    example: '1366 → A.C. (your friend Ali Chaudhry) doing the action of S.S. (a famous singer singing) on the sofa locus.',
    visual: 'dominic',
    tips: ['You can mix: keep Major images but add a person-action for each, which leads directly to PAO (Level 3).'],
  },
  ex: { trainer: 'numbers', cfg: { count: 40, memo: 300, recall: 300 }, task: 'Memorise 40 digits using your 00–99 images (Major or Dominic).', target: 30 },
},
{
  id: 'l2-keyword', level: 2, title: 'Keywords for hard words',
  lit: {
    book: 'An application of the mnemonic keyword method to the acquisition of a Russian vocabulary', author: 'Richard Atkinson & Michael Raugh', year: 1975,
    body: 'Atkinson and Raugh taught students Russian words by linking each one to an English sound-alike keyword and a picture. Students using keywords learned substantially more vocabulary than those using rote repetition. The same trick handles abstract words in the Random Words discipline: when a word has no picture, borrow the picture of a word that sounds like it.',
  },
  tech: {
    intro: 'When a word has no image, use a sound-alike or a symbol.',
    steps: ['Try a symbol first: "honesty" → a hand on a holy book.', 'Else use sound: "ignore" → "an igloo with a door".', 'For foreign words: Japanese "sakura" (cherry blossom) → "sack of uranium" covered in pink blossoms.', 'Place the substitute image on your locus like any other.'],
    example: 'Word list: "liberty, gravity, noise" → Statue of Liberty, an apple falling on a head, a crashing cymbal.',
    visual: 'see',
    tips: ['In Random Words competitions, roughly a fifth of words can be abstract. Pre-decide symbols for common ones.'],
  },
  ex: { trainer: 'words', cfg: { count: 20, memo: 300, recall: 300, abstract: 0.5 }, task: 'Memorise 20 words, half of them abstract.', target: 15 },
},
{
  id: 'l2-names', level: 2, title: 'Names and faces',
  lit: {
    book: 'The Memory Book', author: 'Harry Lorayne & Jerry Lucas', year: 1974,
    body: 'Lorayne\'s method for names has three steps. First, really hear the name. Second, turn the name into a substitute picture that sounds like it. Third, find the most outstanding feature of the face (big eyebrows, a dimple, a long nose) and link the picture to that feature. Later, when you see the face, the feature brings back the picture, and the picture brings back the name.',
  },
  tech: {
    intro: 'Feature + name-picture = name you can recall.',
    steps: ['Pick the face\'s most striking feature: hair, glasses, eyes, mouth, shape.', 'Turn the first name into a picture: "Hiro" → a superhero; "Ayesha" → "eye shine".', 'Turn the surname into a second picture: "Tanaka" → "tan acre", a sun-tanned field.', 'Link both to the feature: a superhero flies out of his big glasses into a tanned field.', 'Optional: link to someone you know with the same name.'],
    example: 'Face with a round orange hairstyle, name "Bilal Khan": a ball (Bilal) bouncing on her round orange hair, landing in a can (Khan).',
    visual: 'faces',
    tips: ['Competitions use names from many countries. Build stock images for common names (Ali, Wei, Maria, Kumar).'],
  },
  ex: { trainer: 'names', cfg: { count: 10, memo: 180, recall: 240 }, task: 'Memorise 10 faces with first and last names. 1 point per correct name.', target: 12 },
},
{
  id: 'l2-dates', level: 2, title: 'Historic and fictional dates',
  lit: {
    book: 'Memoria Technica', author: 'Richard Grey', year: 1730,
    body: 'Grey invented his letter code specifically for chronology: students of his day had to know the dates of kings, battles and councils. He fused the date into the name as an artificial word. Competitions now use invented events ("the first robot opens a bakery") with years between 1000 and 2099, so that nobody has an advantage from knowing history.',
  },
  tech: {
    intro: 'Picture the event, then attach the image for the year.',
    steps: ['Read the event and make one keyword picture: "robot bakery" → a robot kneading dough.', 'Year 1000–2099: the first two digits are only 10–20; use the last two digits as your 00–99 image, and add a marker for the century (e.g. 19__ = it happens in black and white, 20__ = in neon, 18__ = in candlelight).', 'Link the event picture to the year image in one scene. You do not need a palace for dates, but you can use one.'],
    example: '1974: robot bakery. 74 = "car" → the robot bakes bread inside a car, in black and white (19__).',
    visual: 'see',
    tips: ['Wrong answers lose half a point in competition. If unsure, leave blank.'],
  },
  ex: { trainer: 'dates', cfg: { count: 10, memo: 180, recall: 240 }, task: 'Memorise 10 fictional dates. +1 correct, −0.5 wrong.', target: 7 },
},
{
  id: 'l2-cards', level: 2, title: 'Cards: one card, one image',
  lit: {
    book: 'How to Develop a Perfect Memory', author: 'Dominic O\'Brien', year: 1993,
    body: 'O\'Brien\'s early fame came from memorising decks of cards, and he describes giving every card a person or object so that a shuffled deck becomes a walk through a palace full of characters. Speed cards, memorising one shuffled deck as fast as possible, has been a championship event since the first World Memory Championship in 1991. Today\'s best competitors do it in under 15 seconds.',
  },
  tech: {
    intro: 'Give all 52 cards one image each, then walk a deck through a palace.',
    steps: ['Simple code: suit = first letter, value = second. ♠ S, ♥ H, ♦ D, ♣ C. Ace = A, 2–9 use Major (♥5 = H-L = "hell"), 10 = S/Z, J/Q/K = royal people of the suit.', 'Or map cards to your 00–99 numbers: ♠ = 1x, ♥ = 2x, ♦ = 3x, ♣ = 4x (♥7 = 27).', 'Enter your images in Systems → Cards.', 'Memorise one card per locus to start. Later: two or three per locus.'],
    example: '♠K = a dark king; ♥3 = H-M = "ham"; ♦A = a diamond-encrusted ace pilot.',
    visual: 'cards',
    tips: ['Hold the deck and flip cards in a steady rhythm; consistency beats bursts.'],
  },
  ex: { trainer: 'cards', cfg: { count: 13, memo: 180, recall: 240 }, task: 'Memorise 13 cards in order.', target: 13 },
},
{
  id: 'l2-network', level: 2, title: 'A network of palaces',
  lit: {
    book: 'The Memory Palace of Matteo Ricci', author: 'Jonathan Spence', year: 1984,
    body: 'In 1596 the Jesuit Matteo Ricci wrote a treatise on memory in Chinese (Xiguo Jifa) for scholars preparing for the imperial examinations, teaching them to build vast imaginary palaces. Lynne Kelly\'s The Memory Code (2016) shows that non-literate cultures had perfected the idea long before: Aboriginal Australian songlines encode knowledge along routes through the landscape, and Kelly argues that monuments such as Stonehenge may have served as memory sites.',
  },
  tech: {
    intro: 'Competitions need hundreds of loci. Build a library of palaces, each with 20–50 stops.',
    steps: ['List places you know well: homes, schools, relatives\' houses, workplaces, streets, a mosque, a shopping centre.', 'Turn each into a palace of 20–50 stops in the Palaces tab.', 'Name each palace clearly ("Nani\'s house", "Office floor 3").', 'Walk each new palace three times before using it.'],
    example: 'Palaces: Home (30), Office (40), Dolmen Mall (50), University (40) = 160 loci.',
    visual: 'loci',
    tips: ['A national-standard competition needs roughly 300–500 loci across events.', 'Virtual places (video games, films) work if you can see them clearly.'],
  },
  ex: { trainer: 'palace', cfg: { loci: 50, total: true }, task: 'Have at least 50 loci saved across your palaces.', target: 50 },
},

// ═══════════════════════ LEVEL 3 · 上 ADVANCED SYSTEMS ═══════════════════════
{
  id: 'l3-pao', level: 3, title: 'Person–Action–Object (PAO)',
  lit: {
    book: 'Moonwalking with Einstein', author: 'Joshua Foer', year: 2011,
    body: 'Foer trained with a PAO system on his way to the USA title. Each two-digit number gets a person, an action and an object. Six digits then become one scene: the person of the first pair, doing the action of the second, with the object of the third. One image per locus now holds six digits instead of two, and the combinations are far more surprising, which makes them memorable.',
  },
  tech: {
    intro: 'Extend your 00–99 so every number has P, A and O.',
    steps: ['For each number pick a person (P), their typical action (A) and their typical object (O).', 'Example: 52 = a footballer (P) → kicking (A) → a ball (O).', 'Six digits 52 07 86: footballer (52) + action of 07 + object of 86 (fish).', 'One six-digit scene per locus.'],
    example: '07 = a dhobi, action: wringing; 86 = fisherman, object: a fish. 520786 → the footballer wringing a fish.',
    visual: 'pao',
    tips: ['Enter your PAO in Systems → PAO.', 'Some athletes prefer PA (4 digits) or two images per locus. Try both; keep what feels fastest.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 60, memo: 300, recall: 300 }, task: 'Memorise 60 digits with PAO (10 loci).', target: 40 },
},
{
  id: 'l3-paocards', level: 3, title: 'PAO for cards',
  lit: {
    book: 'Moonwalking with Einstein', author: 'Joshua Foer', year: 2011,
    body: 'Foer describes how card competitors give each card a person, action and object too. Three cards become one image, so a full deck fits in 18 loci (17 scenes of three, plus one card). This compression is why sub-30-second decks became possible.',
  },
  tech: {
    intro: 'Three cards per locus: person of card 1, action of card 2, object of card 3.',
    steps: ['Give every card P-A-O (start from your card images in Systems).', 'Group the deck in threes as you flip.', 'Build one scene per locus. 52 cards = 18 loci.', 'Recall: each scene gives you three cards.'],
    example: '♠K ♥3 ♦A → the dark king (P) slicing (action of ham) a diamond (object of ace pilot).',
    visual: 'pao',
    tips: ['If PAO feels slow, two cards per locus is a solid alternative.'],
  },
  ex: { trainer: 'cards', cfg: { count: 26, memo: 300, recall: 300 }, task: 'Memorise half a deck (26 cards) in order.', target: 20 },
},
{
  id: 'l3-two', level: 3, title: 'Two images per place',
  lit: {
    book: 'Interview with Katie Kermode, Big Think', author: 'Katie Kermode (memory world-record holder)', year: 2022,
    body: 'Kermode, who has held several world records and wrote the competition software used at IAM World Championships, describes walking a familiar route (often her home) and placing two images at each stop. Doubling images per locus halves the number of places you need and keeps your walk short, at the cost of having to keep two images clearly separate.',
  },
  tech: {
    intro: 'Put two images on each locus, always in the same relation: left then right, or first image acting on the second.',
    steps: ['Decide a fixed order: image A is always on the left / always the "doer".', 'Two 2-digit images = 4 digits per locus. Two PAO scenes = 12 digits.', 'Practise until you never swap the pair\'s order.'],
    example: 'Sofa locus, digits 5207: the footballer (52) kicks the smelly sock (07) across the sofa.',
    visual: 'loci',
    tips: ['If you often swap pairs, add the rule "first image is always bigger".'],
  },
  ex: { trainer: 'numbers', cfg: { count: 80, memo: 300, recall: 300 }, task: 'Memorise 80 digits at two images (4 digits) per locus.', target: 60 },
},
{
  id: 'l3-binary', level: 3, title: 'Binary numbers',
  lit: {
    book: 'IAM competition rules (Binary Number Events)', author: 'International Association of Memory', year: 'current',
    body: 'In binary events, digits come in rows of 30. A completely correct row scores 30 points; a row with one error scores 15; more errors score nothing. National competitions give 5 minutes to memorise; world-standard events give 30. Competitors never memorise 0s and 1s directly: they convert groups of binary digits into numbers they already have images for.',
  },
  tech: {
    intro: 'Convert 3 binary digits to one decimal digit (0–7), then use your 00–99 images.',
    steps: ['Learn the table: 000=0, 001=1, 010=2, 011=3, 100=4, 101=5, 110=6, 111=7.', '6 binary digits = two decimal digits = one number image. 101 110 → 5 6 → 56.', 'A row of 30 = 5 images.', 'Advanced: a dedicated 64-image binary system (6 digits per image) or Ben Pridmore\'s 1,024-image 10-digit system.'],
    example: '101110 001111 → 56 17 → your images for 56 and 17.',
    visual: 'binary',
    tips: ['Read the 3-digit groups out of the corner of your eye; the conversion becomes automatic within a week.'],
  },
  ex: { trainer: 'binary', cfg: { rows: 3, memo: 300, recall: 600 }, task: 'Memorise 3 rows (90 digits). Row scoring: 30 / 15 / 0.', target: 60 },
},
{
  id: 'l3-three', level: 3, title: '3-digit systems',
  lit: {
    book: 'Interview with Katie Kermode, Big Think', author: 'Ben Pridmore & Katie Kermode', year: 2022,
    body: 'Ben Pridmore, three-time World Memory Champion, built a system with an image for every number from 000 to 999 (the Ben system), and a 2,704-image system for pairs of cards. Kermode uses a version of it: 711 is a cat, 522 red lentils spilling everywhere, and she groups long numbers in threes. A 3-digit system needs 1,000 images, months of work, but stores 50% more per image than 00–99.',
  },
  tech: {
    intro: 'Optional for now. Know how it works, and decide later if you will build one.',
    steps: ['Every 3-digit number gets one image, usually from Major sounds: 711 = k-t-t = "kitty".', 'Build in blocks of 100, drilling each block before starting the next.', 'With 2 images per locus = 6 digits per locus, same as PAO.'],
    example: '711 522 → cat, lentils: a cat swimming in spilled red lentils.',
    visual: 'major',
    tips: ['Most beginners reach national level with 00–99 + PAO. A 3-digit system is a world-level investment.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 100, memo: 300, recall: 600 }, task: 'Memorise 100 digits in 5 minutes with your best system.', target: 70 },
},
{
  id: 'l3-images', level: 3, title: 'Abstract images',
  lit: {
    book: 'IAM statistics, 5-minute random images', author: 'International Association of Memory', year: 2025,
    body: 'In the images discipline you see rows of five abstract black-and-white shapes and must recall their order in each row. The IAM 5-minute record, 775 points, was set by Enrico Marraffa at the 2025 French Open. The IAM has noted that these are disciplines where ready-made systems help least and quick, ad-hoc creativity matters most.',
  },
  tech: {
    intro: 'Give each shape an instant nickname from its most obvious feature, then link the nicknames.',
    steps: ['Glance at shape 1: what does it remind you of? A boot, a bird, a crack?', 'Do the same for shapes 2–5.', 'Link the five nicknames in a quick story, or place them on loci.', 'In recall the row is shuffled: rebuild the order from your story.'],
    example: 'Row: a hook-shape, a spiky star, a blob, a zigzag, a ring → a hook catches a star that drops into jelly, shocked by lightning, through a ring.',
    visual: 'images',
    tips: ['Scoring: +5 for a correct row, −1 for a wrong row. Skip rows you are unsure of.'],
  },
  ex: { trainer: 'images', cfg: { rows: 5, memo: 300, recall: 300 }, task: 'Memorise 5 rows of 5 images.', target: 15 },
},
{
  id: 'l3-spoken', level: 3, title: 'Spoken numbers',
  lit: {
    book: 'World Memory Championships records', author: 'WMSC', year: 2024,
    body: 'Spoken numbers are read aloud at one digit per second. Recall counts only up to your first mistake, which makes it the most nerve-racking event. The WMSC record is 660 digits, set by Hu Xueyan at the 2024 World Championship. You cannot pause or go back, so encoding must keep pace with the voice.',
  },
  tech: {
    intro: 'Hear two digits, see the image, place it, all in two seconds, without falling behind.',
    steps: ['Prepare your palace before the voice starts.', 'Group the digits into your 2-digit images as you hear them.', 'If you miss one, do not panic: you can still score up to that point.', 'Practise with eyes closed to reduce distraction.'],
    example: '"5… 2… 0… 7…" → lion on the door, sock on the shoe rack.',
    visual: 'spoken',
    tips: ['Your phone reads the digits using its built-in voice. Use headphones.'],
  },
  ex: { trainer: 'spoken', cfg: { count: 30 }, task: 'Listen to 30 digits at 1 per second, then recall. Score = digits until first error.', target: 20 },
},
{
  id: 'l3-chunk', level: 3, title: 'Chunking and mental representations',
  lit: {
    book: 'Peak: Secrets from the New Science of Expertise', author: 'Anders Ericsson & Robert Pool', year: 2016,
    body: 'Ericsson describes his famous experiment with a student called SF, whose digit span grew from 7 to over 80 digits after two years of practice. SF was a runner and grouped digits into running times ("3:49.2 is a near-record mile"). Chase and Simon had already shown in 1973 that chess masters remember board positions by recognising meaningful chunks. Expertise, Ericsson concludes, is mostly a library of rich mental representations built by deliberate practice.',
  },
  tech: {
    intro: 'Every system you have built is a chunking device. Train speed at reading the chunks.',
    steps: ['Practise looking at a row and instantly "reading" it in chunks of 2, 4 or 6.', 'Train one-minute sprints (Memory League format): 1 minute memorise, 4 minutes recall.', 'Track your time per image in the Progress tab (録).'],
    example: '520786 is not six digits but one scene: footballer, wringing, fish.',
    visual: 'pao',
    tips: ['The five Memory League disciplines are one-minute names, words, images, numbers and cards.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 40, memo: 60, recall: 240 }, task: 'Memory League sprint: as many of 40 digits as you can in 60 seconds.', target: 24 },
},
{
  id: 'l3-oral', level: 3, title: 'Rhythm, sound and oral traditions',
  lit: {
    book: 'Vedic recitation and the hifz tradition', author: 'Oral traditions of South Asia', year: 'ancient – today',
    body: 'Long before writing, the Vedas were preserved by recitation in multiple patterns: pada-pāṭha (word by word), krama (pairs: 1-2, 2-3, 3-4) and complex weaves like jaṭā and ghana that repeat words forwards and backwards. Each pattern checks the others, so a single error is caught. In Japan, the monk Kūkai (774–835) practised the Kokūzō Gumonji-hō, a memory ritual of reciting a mantra a million times. Both show that rhythm, sound and structured repetition are powerful memory tools.',
  },
  tech: {
    intro: 'For spoken and verbal material, use rhythm and pattern-checking.',
    steps: ['Listen in rhythmic groups: hear "five-two, oh-seven" as two beats.', 'For short sequences, rehearse krama-style: 52-07, 07-86, 86-14 to strengthen the links.', 'For long-term material (speeches, verses), recite in a steady rhythm and review with sabaq/sabqi/manzil.'],
    example: '"52 07 86" rehearsed as 52→07, 07→86: each pair checks its neighbour.',
    visual: 'chain',
    tips: ['Rhythm also calms breathing, which helps in spoken numbers.'],
  },
  ex: { trainer: 'spoken', cfg: { count: 40 }, task: 'Spoken numbers, 40 digits. Hear them in rhythmic pairs.', target: 26 },
},

// ═══════════════════════ LEVEL 4 · 速 SPEED & VOLUME ═══════════════════════
{
  id: 'l4-deliberate', level: 4, title: 'Deliberate practice and the OK plateau',
  lit: {
    book: 'Moonwalking with Einstein & Peak', author: 'Joshua Foer; Anders Ericsson', year: '2011 / 2016',
    body: 'Foer describes hitting the "OK plateau": the point where a skill feels good enough and stops improving because you stop paying attention. Following Ericsson, his way out was deliberate practice: push slightly beyond your comfort, measure every attempt, study your mistakes, and get feedback. Foer forced himself to memorise cards faster than felt comfortable, then analysed which cards he got wrong and why.',
  },
  tech: {
    intro: 'From now on every session has a measurable target slightly above your best.',
    steps: ['Check your personal best in Progress (録).', 'Set the next attempt 10–20% faster or longer.', 'After each attempt, look at every error: weak image? bad locus? lost focus?', 'Fix the cause (replace an image, change a locus) before the next attempt.'],
    example: 'Best: 40 digits in 1 min. Next: 48 digits in 1 min. Errors on 69 and 96 → images too similar → change one.',
    visual: 'curve',
    tips: ['Note down errors in your voice diary (声の日記) right after the session.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 60, memo: 60, recall: 240 }, task: 'Sprint: 60 digits, 1 minute. Then note your errors in the voice diary.', target: 36 },
},
{
  id: 'l4-speednum', level: 4, title: 'Speed numbers',
  lit: {
    book: 'World Memory Championships records', author: 'IAM / WMSC', year: 2024,
    body: 'In speed numbers you have 5 minutes to memorise rows of digits (40 per row at world level). A full correct row scores its length; one error halves it; more errors score zero. The 5-minute record is 642 digits, set by Wei Qinru at the IMO Korea Open in 2024. That is more than two digits per second, sustained for five minutes.',
  },
  tech: {
    intro: 'Volume needs rhythm. Work in blocks and keep an even pace.',
    steps: ['Plan loci before starting: 200 digits at 4 per locus = 50 loci.', 'Work row by row with a quick review at the end of each row (optional).', 'In recall, write row by row; leave rows you are unsure of partly blank rather than wrong.', 'Use the full time on early attempts; later, keep 30 seconds for a final review.'],
    example: '200 digits = 5 rows of 40. Target: 4 rows fully correct.',
    visual: 'rows',
    tips: ['A wrong digit in a row costs half the row. Accuracy beats volume.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 200, memo: 300, recall: 900, rowLen: 40 }, task: 'National-standard speed numbers: up to 200 digits in 5 minutes.', target: 120 },
},
{
  id: 'l4-speedcards', level: 4, title: 'Speed cards',
  lit: {
    book: 'World Memory Championships records', author: 'IAM', year: 2018,
    body: 'The speed cards record is 12.74 seconds for a full deck, set by Shijir-Erdene Bat-Enkh of Mongolia at the IAM Korea Open in 2018. For decades, a deck under two minutes was the classic benchmark of a serious competitor. Your time only counts if every card is correct.',
  },
  tech: {
    intro: 'Aim first for a clean deck under 5 minutes, then under 2.',
    steps: ['Use the same palace for every speed-card attempt, so the walk is automatic.', 'Flip in a steady rhythm; do not stop to review mid-deck.', 'Stop the clock the moment you finish, then recall.', 'Track time and errors in Progress.'],
    example: 'Deck with PAO = 18 loci. Target pace: 5 seconds per locus = 90 seconds.',
    visual: 'cards',
    tips: ['When a card is wrong, find out why: weak image, two similar images, or a rushed locus.'],
  },
  ex: { trainer: 'cards', cfg: { count: 52, memo: 300, recall: 300, speed: true }, task: 'Full deck. Tap "Done" as soon as you finish memorising.', target: 52 },
},
{
  id: 'l4-recycle', level: 4, title: 'Recycling palaces',
  lit: {
    book: 'Institutio Oratoria, Book XI', author: 'Quintilian', year: 'c. 95 CE',
    body: 'Quintilian, the Roman teacher of rhetoric, explains the house method in practical detail and adds a striking observation: what seems lost one evening is often stronger the next day, after a night\'s sleep. Competitors use both facts. They train palaces until the walk is automatic, then reuse them; images from a previous session fade, especially after sleep, leaving the palace clean.',
    quote: { text: 'It is a curious fact… that an interval of a single night greatly increases the strength of the memory.', note: 'Quintilian, Institutio Oratoria XI.2.43, our translation' },
  },
  tech: {
    intro: 'Rotate palaces so each one rests 1–2 days before reuse.',
    steps: ['Divide your palaces into groups (A, B, C).', 'Day 1 train with group A, day 2 B, day 3 C, then A again.', 'If old images "ghost" into new sessions, rest that palace longer.', 'Keep your best palaces for competitions only.'],
    example: 'Palaces A: Home + Office; B: University + Mall; C: Nani\'s house + Street.',
    visual: 'loci',
    tips: ['Sleep well before competitions; Quintilian noticed it 2,000 years ago, and modern sleep research agrees.'],
  },
  ex: { trainer: 'words', cfg: { count: 50, memo: 600, recall: 900, abstract: 0.2 }, task: 'Memorise 50 words in a recycled palace (10 minutes).', target: 40 },
},
{
  id: 'l4-long', level: 4, title: 'Long events and review strategy',
  lit: {
    book: 'Peak', author: 'Anders Ericsson & Robert Pool', year: 2016,
    body: 'Ericsson stresses that elite performers plan practice around specific weaknesses. In long memory events (15, 30, 60 minutes) the weakness is decay: images placed early fade before recall. Competitors choose between a one-pass strategy (memorise once, carefully) and multi-pass strategies (memorise a block, review it, move on, and review everything at the end), and test which gives them the highest score.',
  },
  tech: {
    intro: 'Experiment with review patterns and keep what scores best.',
    steps: ['One-pass: slower, deeper images, no review.', 'Block review: memorise 1 palace, review it once quickly, continue.', 'Final review: keep the last 10% of time to review the first palace.', 'Record which pattern you used and the score in your diary.'],
    example: '15-minute numbers: 5 blocks of 2.5 minutes + 1 minute final review of block 1 and 2.',
    visual: 'rows',
    tips: ['Long events are won by accuracy. Fewer, cleaner rows beat many broken rows.'],
  },
  ex: { trainer: 'numbers', cfg: { count: 300, memo: 900, recall: 1800, rowLen: 40 }, task: '15-minute numbers: up to 300 digits.', target: 160 },
},
{
  id: 'l4-calm', level: 4, title: 'Calm under the clock',
  lit: {
    book: 'Zen breath counting (数息観 susokukan)', author: 'Zen tradition', year: 'traditional',
    body: 'Zen beginners are taught susokukan: count each out-breath from one to ten, and when the mind wanders, return to one without judgement. It trains exactly the skill memory athletes need: noticing distraction and returning attention instantly. The 2017 Neuron study by Dresler and colleagues found that memory athletes\' brains look normal in structure; the difference is in how brain networks are used, which is trained, not born.',
  },
  tech: {
    intro: 'Three minutes of breath counting before every serious attempt.',
    steps: ['Sit upright, eyes half closed.', 'Count each out-breath: one… two… up to ten, then start again.', 'If you lose count, return to one. That return is the training.', 'Then begin your event immediately.'],
    example: 'Before speed cards: 3 minutes 数息観, then flip the first card.',
    visual: 'breath',
    tips: ['Under pressure, slow your out-breath. It lowers heart rate within seconds.'],
  },
  ex: { trainer: 'breath', cfg: { minutes: 3 }, task: 'Do 3 minutes of guided breath counting.', target: 1 },
},
{
  id: 'l4-intnames', level: 4, title: 'International names',
  lit: {
    book: 'Memory League rules', author: 'Memory League & IAM', year: 2024,
    body: 'Memory League has six disciplines, including separate national and international names, because unfamiliar names are much harder. A Japanese competitor finds "Oluwaseun" hard; a Nigerian competitor finds "Tsubasa" hard. Champions build stock images for name parts from many cultures.',
  },
  tech: {
    intro: 'Break unfamiliar names into sound-pieces you can picture.',
    steps: ['Split the name: "Oluwaseun" → "Olu-wa-seun" → "oil-water-sun".', 'Keep a stock image for common parts: "-ko" (Japanese girls\' names) → a koala; "Mohammad" → a crescent; "Wei" → a scale (weigh).', 'Link to the face\'s strongest feature as before.'],
    example: '"Haruto Sato" with thick eyebrows: a hare (Haru) toting (to) a bag of sugar (Sato sounds like 砂糖 satō, "sugar") on his eyebrows.',
    visual: 'faces',
    tips: ['Note difficult name-parts in your voice diary and build images later.'],
  },
  ex: { trainer: 'names', cfg: { count: 20, memo: 300, recall: 600 }, task: 'Memorise 20 international names and faces in 5 minutes.', target: 22 },
},

// ═══════════════════════ LEVEL 5 · 達 COMPETITION READY ═══════════════════════
{
  id: 'l5-rules', level: 5, title: 'The ten disciplines and scoring',
  lit: {
    book: 'World Memory Championship formats', author: 'WMSC / IAM', year: 'current',
    body: 'Classic championships have ten disciplines: names and faces, binary numbers, long numbers, abstract images, speed numbers, historic dates, random cards, random words, spoken numbers and speed cards. National, international and world standards use the same ten events with increasing time limits; at a world championship every discipline runs at maximum length (for example one-hour numbers and one-hour cards). Always read the rulebook of your specific event, as WMSC and IAM differ in details.',
  },
  tech: {
    intro: 'Know the scoring of every event so you never lose points to rules.',
    steps: ['Numbers & binary: rows. Full row = full points, one error = half, more = 0.', 'Words: columns, similar to rows.', 'Names: 1 point per correct first or last name; spelling must be phonetically right.', 'Dates: +1 correct, −0.5 wrong. Images: +5 correct row, −1 wrong row.', 'Spoken: digits until the first error. Speed cards: fastest full correct deck.'],
    example: 'A row of 40 digits with one wrong digit = 20 points. Leaving the doubtful digit blank also = 20.',
    visual: 'rows',
    tips: ['World records (2026): hour numbers 4,620; 5-min numbers 642; spoken 660; 30-min binary 7,485; 15-min words 335; 15-min names 224; 5-min dates 154; speed cards 12.74 s.'],
  },
  ex: { trainer: 'words', cfg: { count: 60, memo: 300, recall: 900, abstract: 0.2, colLen: 20 }, task: 'National-standard random words: 5 minutes. Scored by columns of 20.', target: 30 },
},
{
  id: 'l5-season', level: 5, title: 'Preparing for a championship',
  lit: {
    book: 'Mnemonic training reshapes brain networks (Neuron)', author: 'Martin Dresler et al.', year: 2017,
    body: 'Dresler\'s team compared the world\'s top memory athletes with matched controls and found no special brain anatomy. Then they trained ordinary people with the method of loci for six weeks, 30 minutes a day. Their recall of word lists more than doubled, the gains lasted months later, and their brain connectivity shifted toward the athletes\' pattern. The message for a competitor: consistent daily training is what builds championship memory.',
  },
  tech: {
    intro: 'A 12-week plan: build, sharpen, simulate, taper.',
    steps: ['Weeks 1–4 (build): finish all systems; 45–60 min daily; drill images.', 'Weeks 5–8 (sharpen): event-specific training; one discipline focus per day.', 'Weeks 9–11 (simulate): one mock championship per week, with official timings.', 'Week 12 (taper): light practice, rest palaces, sleep well, travel.'],
    example: 'Mon numbers · Tue cards · Wed names+words · Thu binary+images · Fri spoken+dates · Sat mock · Sun rest.',
    visual: 'curve',
    tips: ['Allocate fixed palaces to each event in advance and never improvise on the day.'],
  },
  ex: { trainer: 'mock', cfg: { mode: 'mini' }, task: 'Mini mock: words, numbers and cards back to back.', target: 1 },
},
{
  id: 'l5-mock', level: 5, title: 'Full mock championship',
  lit: {
    book: 'The Book of Five Rings', author: 'Miyamoto Musashi', year: 1645,
    body: 'Musashi wrote his treatise after a lifetime undefeated in duels. His constant advice is to train until technique is part of you, and to compete with the same calm mind you train with. He separates forging (a thousand days) from polishing (ten thousand days). A mock championship is your polishing: the full ten disciplines, at standard timings, under pressure, in one day.',
  },
  tech: {
    intro: 'Run all ten disciplines at national-standard timings. Treat it like the real day.',
    steps: ['Plan a quiet half-day. Phone on silent except for this app.', 'Do 3 minutes of breath counting before each event.', 'Follow the order the app gives you; rest 5–10 minutes between events.', 'Record your total and every event score; compare with previous mocks.'],
    example: 'Order: names, binary, numbers, images, speed numbers, dates, cards, words, spoken, speed cards.',
    visual: 'rows',
    tips: ['お疲れ様 (otsukaresama): after a mock, rest. Review errors the next day.'],
  },
  ex: { trainer: 'mock', cfg: { mode: 'full' }, task: 'All 10 disciplines, national-standard timings.', target: 1 },
},
];

// National-standard style timings used by the mock championship (memorise / recall in seconds).
export const MOCK_EVENTS = [
  { id: 'names', name: 'Names & faces', k: '名前と顔', trainer: 'names', cfg: { count: 30, memo: 300, recall: 900 } },
  { id: 'binary', name: 'Binary numbers', k: '二進数', trainer: 'binary', cfg: { rows: 20, memo: 300, recall: 900 } },
  { id: 'numbers', name: '15-min numbers', k: '数字', trainer: 'numbers', cfg: { count: 400, memo: 900, recall: 1800, rowLen: 40 } },
  { id: 'images', name: 'Abstract images', k: '図形', trainer: 'images', cfg: { rows: 30, memo: 300, recall: 900 } },
  { id: 'speednum', name: 'Speed numbers', k: '数字', trainer: 'numbers', cfg: { count: 240, memo: 300, recall: 900, rowLen: 40 } },
  { id: 'dates', name: 'Dates', k: '年号', trainer: 'dates', cfg: { count: 40, memo: 300, recall: 900 } },
  { id: 'cards', name: '10-min cards', k: '札', trainer: 'cards', cfg: { count: 104, memo: 600, recall: 1800 } },
  { id: 'words', name: 'Random words', k: '単語', trainer: 'words', cfg: { count: 100, memo: 300, recall: 900, abstract: 0.2, colLen: 20 } },
  { id: 'spoken', name: 'Spoken numbers', k: '音声数字', trainer: 'spoken', cfg: { count: 100 } },
  { id: 'speedcards', name: 'Speed cards', k: '札', trainer: 'cards', cfg: { count: 52, memo: 300, recall: 300, speed: true } },
];
export const MINI_EVENTS = [
  { id: 'words', name: 'Random words', k: '単語', trainer: 'words', cfg: { count: 40, memo: 300, recall: 600, colLen: 20 } },
  { id: 'numbers', name: 'Speed numbers', k: '数字', trainer: 'numbers', cfg: { count: 160, memo: 300, recall: 600, rowLen: 40 } },
  { id: 'speedcards', name: 'Speed cards', k: '札', trainer: 'cards', cfg: { count: 52, memo: 300, recall: 300, speed: true } },
];

export const RECORDS = [
  ['Hour numbers', '4,620 digits', 'Ryu Song I, 2019'],
  ['5-minute numbers', '642 digits', 'Wei Qinru, 2024'],
  ['Spoken numbers', '660 digits', 'Hu Xueyan, 2024'],
  ['30-minute binary', '7,485 digits', 'Ryu Song I, 2019'],
  ['15-minute words', '335 words', 'Prateek Yadav, 2019'],
  ['15-minute names', '224 names', 'Katie Kermode, 2018'],
  ['5-minute dates', '154 dates', 'Prateek Yadav, 2019'],
  ['Hour cards', '2,530 cards', 'Kim Su Rim, 2019'],
  ['Speed cards', '12.74 seconds', 'Shijir-Erdene Bat-Enkh, 2018'],
  ['5-minute images (IAM)', '775 points', 'Enrico Marraffa, 2025'],
];
