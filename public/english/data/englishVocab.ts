// File được tự động tạo bởi scripts/download_english_dataset.mjs
// Chuẩn từ vựng kết hợp: Cambridge Pre-A1 Starters & Family and Friends (Levels 1 & 2)

export type EnglishCategory = 
  | 'family'
  | 'school'
  | 'toys'
  | 'body'
  | 'animals'
  | 'food'
  | 'clothes'
  | 'house';

export interface EnglishWordItem {
  id: string;
  word: string;
  meaningVi: string;
  category: EnglishCategory;
  image: string;
}

export const VOCAB_ITEMS: EnglishWordItem[] = [
  {
    "id": "baby",
    "word": "Baby",
    "meaningVi": "Em bé",
    "category": "family",
    "image": "/images/english/baby.svg"
  },
  {
    "id": "boy",
    "word": "Boy",
    "meaningVi": "Cậu bé",
    "category": "family",
    "image": "/images/english/boy.svg"
  },
  {
    "id": "girl",
    "word": "Girl",
    "meaningVi": "Cô bé",
    "category": "family",
    "image": "/images/english/girl.svg"
  },
  {
    "id": "pen",
    "word": "Pen",
    "meaningVi": "Bút mực",
    "category": "school",
    "image": "/images/english/pen.svg"
  },
  {
    "id": "pencil",
    "word": "Pencil",
    "meaningVi": "Bút chì",
    "category": "school",
    "image": "/images/english/pencil.svg"
  },
  {
    "id": "eraser",
    "word": "Eraser",
    "meaningVi": "Cục tẩy",
    "category": "school",
    "image": "/images/english/eraser.svg"
  },
  {
    "id": "ruler",
    "word": "Ruler",
    "meaningVi": "Thước kẻ",
    "category": "school",
    "image": "/images/english/ruler.svg"
  },
  {
    "id": "book",
    "word": "Book",
    "meaningVi": "Quyển sách",
    "category": "school",
    "image": "/images/english/book.svg"
  },
  {
    "id": "bag",
    "word": "Bag",
    "meaningVi": "Cặp sách",
    "category": "school",
    "image": "/images/english/bag.svg"
  },
  {
    "id": "door",
    "word": "Door",
    "meaningVi": "Cửa ra vào",
    "category": "school",
    "image": "/images/english/door.svg"
  },
  {
    "id": "window",
    "word": "Window",
    "meaningVi": "Cửa sổ",
    "category": "school",
    "image": "/images/english/window.svg"
  },
  {
    "id": "ball",
    "word": "Ball",
    "meaningVi": "Quả bóng",
    "category": "toys",
    "image": "/images/english/ball.svg"
  },
  {
    "id": "doll",
    "word": "Doll",
    "meaningVi": "Búp bê",
    "category": "toys",
    "image": "/images/english/doll.svg"
  },
  {
    "id": "teddy_bear",
    "word": "Teddy bear",
    "meaningVi": "Gấu bông",
    "category": "toys",
    "image": "/images/english/teddy_bear.svg"
  },
  {
    "id": "car",
    "word": "Car",
    "meaningVi": "Ô tô đồ chơi",
    "category": "toys",
    "image": "/images/english/car.svg"
  },
  {
    "id": "train",
    "word": "Train",
    "meaningVi": "Tàu hỏa",
    "category": "toys",
    "image": "/images/english/train.svg"
  },
  {
    "id": "kite",
    "word": "Kite",
    "meaningVi": "Con diều",
    "category": "toys",
    "image": "/images/english/kite.svg"
  },
  {
    "id": "bike",
    "word": "Bike",
    "meaningVi": "Xe đạp",
    "category": "toys",
    "image": "/images/english/bike.svg"
  },
  {
    "id": "eye",
    "word": "Eye",
    "meaningVi": "Mắt",
    "category": "body",
    "image": "/images/english/eye.svg"
  },
  {
    "id": "nose",
    "word": "Nose",
    "meaningVi": "Mũi",
    "category": "body",
    "image": "/images/english/nose.svg"
  },
  {
    "id": "ear",
    "word": "Ear",
    "meaningVi": "Tai",
    "category": "body",
    "image": "/images/english/ear.svg"
  },
  {
    "id": "mouth",
    "word": "Mouth",
    "meaningVi": "Miệng",
    "category": "body",
    "image": "/images/english/mouth.svg"
  },
  {
    "id": "hand",
    "word": "Hand",
    "meaningVi": "Bàn tay",
    "category": "body",
    "image": "/images/english/hand.svg"
  },
  {
    "id": "arm",
    "word": "Arm",
    "meaningVi": "Cánh tay",
    "category": "body",
    "image": "/images/english/arm.svg"
  },
  {
    "id": "leg",
    "word": "Leg",
    "meaningVi": "Chân",
    "category": "body",
    "image": "/images/english/leg.svg"
  },
  {
    "id": "foot",
    "word": "Foot",
    "meaningVi": "Bàn chân",
    "category": "body",
    "image": "/images/english/foot.svg"
  },
  {
    "id": "cat",
    "word": "Cat",
    "meaningVi": "Con mèo",
    "category": "animals",
    "image": "/images/english/cat.svg"
  },
  {
    "id": "dog",
    "word": "Dog",
    "meaningVi": "Con chó",
    "category": "animals",
    "image": "/images/english/dog.svg"
  },
  {
    "id": "bird",
    "word": "Bird",
    "meaningVi": "Con chim",
    "category": "animals",
    "image": "/images/english/bird.svg"
  },
  {
    "id": "fish",
    "word": "Fish",
    "meaningVi": "Con cá",
    "category": "animals",
    "image": "/images/english/fish.svg"
  },
  {
    "id": "duck",
    "word": "Duck",
    "meaningVi": "Con vịt",
    "category": "animals",
    "image": "/images/english/duck.svg"
  },
  {
    "id": "frog",
    "word": "Frog",
    "meaningVi": "Con ếch",
    "category": "animals",
    "image": "/images/english/frog.svg"
  },
  {
    "id": "tiger",
    "word": "Tiger",
    "meaningVi": "Con hổ",
    "category": "animals",
    "image": "/images/english/tiger.svg"
  },
  {
    "id": "monkey",
    "word": "Monkey",
    "meaningVi": "Con khỉ",
    "category": "animals",
    "image": "/images/english/monkey.svg"
  },
  {
    "id": "elephant",
    "word": "Elephant",
    "meaningVi": "Con voi",
    "category": "animals",
    "image": "/images/english/elephant.svg"
  },
  {
    "id": "rabbit",
    "word": "Rabbit",
    "meaningVi": "Con thỏ",
    "category": "animals",
    "image": "/images/english/rabbit.svg"
  },
  {
    "id": "cow",
    "word": "Cow",
    "meaningVi": "Con bò sữa",
    "category": "animals",
    "image": "/images/english/cow.svg"
  },
  {
    "id": "apple",
    "word": "Apple",
    "meaningVi": "Quả táo",
    "category": "food",
    "image": "/images/english/apple.svg"
  },
  {
    "id": "banana",
    "word": "Banana",
    "meaningVi": "Quả chuối",
    "category": "food",
    "image": "/images/english/banana.svg"
  },
  {
    "id": "bread",
    "word": "Bread",
    "meaningVi": "Bánh mì",
    "category": "food",
    "image": "/images/english/bread.svg"
  },
  {
    "id": "cake",
    "word": "Cake",
    "meaningVi": "Bánh ngọt",
    "category": "food",
    "image": "/images/english/cake.svg"
  },
  {
    "id": "ice_cream",
    "word": "Ice cream",
    "meaningVi": "Kem",
    "category": "food",
    "image": "/images/english/ice_cream.svg"
  },
  {
    "id": "cookie",
    "word": "Cookie",
    "meaningVi": "Bánh quy",
    "category": "food",
    "image": "/images/english/cookie.svg"
  },
  {
    "id": "milk",
    "word": "Milk",
    "meaningVi": "Sữa",
    "category": "food",
    "image": "/images/english/milk.svg"
  },
  {
    "id": "water",
    "word": "Water",
    "meaningVi": "Nước",
    "category": "food",
    "image": "/images/english/water.svg"
  },
  {
    "id": "pizza",
    "word": "Pizza",
    "meaningVi": "Bánh pizza",
    "category": "food",
    "image": "/images/english/pizza.svg"
  },
  {
    "id": "carrot",
    "word": "Carrot",
    "meaningVi": "Củ cà rốt",
    "category": "food",
    "image": "/images/english/carrot.svg"
  },
  {
    "id": "hat",
    "word": "Hat",
    "meaningVi": "Chiếc mũ",
    "category": "clothes",
    "image": "/images/english/hat.svg"
  },
  {
    "id": "t_shirt",
    "word": "T-shirt",
    "meaningVi": "Áo phông",
    "category": "clothes",
    "image": "/images/english/t_shirt.svg"
  },
  {
    "id": "dress",
    "word": "Dress",
    "meaningVi": "Váy liền",
    "category": "clothes",
    "image": "/images/english/dress.svg"
  },
  {
    "id": "pants",
    "word": "Pants",
    "meaningVi": "Quần dài",
    "category": "clothes",
    "image": "/images/english/pants.svg"
  },
  {
    "id": "shoes",
    "word": "Shoes",
    "meaningVi": "Đôi giày",
    "category": "clothes",
    "image": "/images/english/shoes.svg"
  },
  {
    "id": "socks",
    "word": "Socks",
    "meaningVi": "Đôi tất",
    "category": "clothes",
    "image": "/images/english/socks.svg"
  },
  {
    "id": "house",
    "word": "House",
    "meaningVi": "Ngôi nhà",
    "category": "house",
    "image": "/images/english/house.svg"
  },
  {
    "id": "bed",
    "word": "Bed",
    "meaningVi": "Chiếc giường",
    "category": "house",
    "image": "/images/english/bed.svg"
  },
  {
    "id": "chair",
    "word": "Chair",
    "meaningVi": "Cái ghế",
    "category": "house",
    "image": "/images/english/chair.svg"
  },
  {
    "id": "table",
    "word": "Table",
    "meaningVi": "Cái bàn",
    "category": "house",
    "image": "/images/english/table.svg"
  },
  {
    "id": "clock",
    "word": "Clock",
    "meaningVi": "Đồng hồ",
    "category": "house",
    "image": "/images/english/clock.svg"
  }
];
