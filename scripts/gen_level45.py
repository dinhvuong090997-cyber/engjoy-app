#!/usr/bin/env python3
"""Generate Level 4-5 vocabulary entries for EngJoy and insert into seed.ts."""

import re, sys

# ── Level 4 vocabulary (Upper Intermediate) ────────────────────────────
# Target 70 new words to reach ~300 total (232 existing + 70 = 302)
LV4_WORDS = [
    # animals (7)
    ("squirrel", "🐿️", "sóc", "Squirrel stores nuts for winter.", "Sóc dự trữ hạt cho mùa đông.", "noun", "animals"),
    ("hedgehog", "🦔", "nhím", "Hedgehog curls into a ball.", "Nhím cuộn tròn.", "noun", "animals"),
    ("parrot", "🦜", "vẹt", "Parrot can mimic human speech.", "Vẹt có thể bắt chước tiếng người.", "noun", "animals"),
    ("leopard", "🐆", "báo hoa mai", "Leopard has spotted fur.", "Báo hoa mai có lông đốm.", "noun", "animals"),
    ("gorilla", "🦍", "khỉ đột", "Gorilla is very strong.", "Khỉ đột rất khỏe.", "noun", "animals"),
    ("raccoon", "🦝", "gấu mèo", "Raccoon washes its food.", "Gấu mèo rửa thức ăn.", "noun", "animals"),
    ("starfish", "⭐", "sao biển", "Starfish has five arms.", "Sao biển có năm cánh.", "noun", "animals"),
    # food (7)
    ("tofu", "🧈", "đậu phụ", "Tofu is made from soybeans.", "Đậu phụ làm từ đậu nành.", "noun", "food"),
    ("popcorn", "🍿", "bỏng ngô", "Popcorn pops in hot oil.", "Bỏng ngô nổ trong dầu nóng.", "noun", "food"),
    ("pancake", "🥞", "bánh kếp", "Pancake is fluffy.", "Bánh kếp xốp.", "noun", "food"),
    ("yogurt", "🫗", "sữa chua", "Yogurt is good for digestion.", "Sữa chua tốt cho tiêu hóa.", "noun", "food"),
    ("sandwich", "🥪", "bánh sandwich", "Sandwich has two slices of bread.", "Bánh sandwich có hai lát bánh mì.", "noun", "food"),
    ("ketchup", "🫙", "sốt cà chua", "Ketchup goes well with fries.", "Sốt cà chua hợp với khoai tây chiên.", "noun", "food"),
    ("mayonnaise", "🥚", "sốt mayonnaise", "Mayonnaise is creamy.", "Mayonnaise có vị béo.", "noun", "food"),
    # school (7)
    ("compass", "🧭", "compa", "Compass draws circles.", "Compa vẽ hình tròn.", "noun", "school"),
    ("protractor", "📐", "thước đo góc", "Protractor measures angles.", "Thước đo góc đo các góc.", "noun", "school"),
    ("backpack", "🎒", "ba lô", "Backpack holds school books.", "Ba lô đựng sách vở.", "noun", "school"),
    ("certificate", "📜", "chứng chỉ", "She received a certificate.", "Cô ấy nhận được chứng chỉ.", "noun", "school"),
    ("dormitory", "🏘️", "ký túc xá", "Dormitory houses students.", "Ký túc xá cho sinh viên ở.", "noun", "school"),
    ("scholar", "🏅", "học giả", "Scholar researches history.", "Học giả nghiên cứu lịch sử.", "noun", "school"),
    ("tuition", "💰", "học phí", "Tuition is paid each semester.", "Học phí đóng mỗi học kỳ.", "noun", "school"),
    # weather (7)
    ("drought", "🏜️", "hạn hán", "Drought causes water shortage.", "Hạn hán gây thiếu nước.", "noun", "weather"),
    ("monsoon", "🌧️", "gió mùa", "Monsoon brings heavy rain.", "Gió mùa mang mưa lớn.", "noun", "weather"),
    ("blizzard", "❄️", "bão tuyết", "Blizzard reduces visibility.", "Bão tuyết làm giảm tầm nhìn.", "noun", "weather"),
    ("thunderstorm", "⛈️", "dông bão", "Thunderstorm has lightning.", "Dông bão có sấm chớp.", "noun", "weather"),
    ("forecast", "📡", "dự báo", "Check the forecast before traveling.", "Xem dự báo trước khi đi.", "noun", "weather"),
    ("climate", "🌍", "khí hậu", "Climate changes over time.", "Khí hậu thay đổi theo thời gian.", "noun", "weather"),
    ("drizzle", "🌦️", "mưa phùn", "Drizzle is very light rain.", "Mưa phùn là mưa rất nhẹ.", "noun", "weather"),
    # nature (7)
    ("canyon", "🏞️", "hẻm núi", "Canyon is a deep valley.", "Hẻm núi là thung lũng sâu.", "noun", "nature"),
    ("cliff", "🧗", "vách đá", "Cliff drops steeply.", "Vách đá dốc đứng.", "noun", "nature"),
    ("swamp", "🌿", "đầm lầy", "Swamp is wet and muddy.", "Đầm lầy ẩm và lầy lội.", "noun", "nature"),
    ("coral", "🪸", "san hô", "Coral reef is colorful.", "Rạn san hô đầy màu sắc.", "noun", "nature"),
    ("volcano", "🌋", "núi lửa", "Volcano erupts lava.", "Núi lửa phun dung nham.", "noun", "nature"),
    ("glacier", "🧊", "sông băng", "Glacier moves slowly.", "Sông băng di chuyển chậm.", "noun", "nature"),
    ("tide", "🌊", "thủy triều", "Tide rises and falls.", "Thủy triều lên xuống.", "noun", "nature"),
    # body (7)
    ("pulse", "🫀", "mạch", "Doctor checks the pulse.", "Bác sĩ kiểm tra mạch.", "noun", "body"),
    ("skeleton", "💀", "bộ xương", "Skeleton supports the body.", "Bộ xương nâng đỡ cơ thể.", "noun", "body"),
    ("kidney", "🫘", "thận", "Kidney filters waste.", "Thận lọc chất thải.", "noun", "body"),
    ("bladder", "🫧", "bàng quang", "Bladder stores urine.", "Bàng quang chứa nước tiểu.", "noun", "body"),
    ("pancreas", "🧬", "tuyến tụy", "Pancreas produces insulin.", "Tuyến tụy sản xuất insulin.", "noun", "body"),
    ("thyroid", "🧪", "tuyến giáp", "Thyroid controls metabolism.", "Tuyến giáp kiểm soát trao đổi chất.", "noun", "body"),
    ("joint", "🦵", "khớp", "Joint connects bones.", "Khớp nối các xương.", "noun", "body"),
    # fruits (5)
    ("passion fruit", "🍈", "chanh dây", "Passion fruit has many seeds.", "Chanh dây có nhiều hạt.", "noun", "fruits"),
    ("dragon fruit", "🐉", "thanh long", "Dragon fruit is pink outside.", "Thanh long vỏ hồng.", "noun", "fruits"),
    ("lychee", "🍒", "vải", "Lychee is sweet and juicy.", "Vải ngọt và mọng nước.", "noun", "fruits"),
    ("rambutan", "🍓", "chôm chôm", "Rambutan has hairy skin.", "Chôm chôm có vỏ có lông.", "noun", "fruits"),
    ("mangosteen", "🟣", "măng cụt", "Mangosteen is purple.", "Măng cụt màu tím.", "noun", "fruits"),
    # vegetables (5)
    ("asparagus", "🥦", "măng tây", "Asparagus is a green vegetable.", "Măng tây là rau xanh.", "noun", "vegetables"),
    ("cauliflower", "🥬", "súp lơ trắng", "Cauliflower is white.", "Súp lơ trắng có màu trắng.", "noun", "vegetables"),
    ("radish", "🌶️", "củ cải đỏ", "Radish is crunchy.", "Củ cải đỏ giòn.", "noun", "vegetables"),
    ("pumpkin", "🎃", "bí đỏ", "Pumpkin is orange.", "Bí đỏ màu cam.", "noun", "vegetables"),
    ("mushroom", "🍄", "nấm", "Mushroom grows in forests.", "Nấm mọc trong rừng.", "noun", "vegetables"),
    # transport (5)
    ("submarine", "🛳️", "tàu ngầm", "Submarine travels underwater.", "Tàu ngầm đi dưới nước.", "noun", "transport"),
    ("helicopter", "🚁", "trực thăng", "Helicopter can hover.", "Trực thăng có thể lơ lửng.", "noun", "transport"),
    ("scooter", "🛴", "xe tay ga", "Scooter is for short trips.", "Xe tay ga cho quãng ngắn.", "noun", "transport"),
    ("caravan", "🚐", "xe lưu động", "Caravan is a mobile home.", "Xe lưu động là nhà di động.", "noun", "transport"),
    ("ferry", "⛴️", "phà", "Ferry crosses the river.", "Phà qua sông.", "noun", "transport"),
    # emotions (5)
    ("curious", "🤔", "tò mò", "She is curious about everything.", "Cô ấy tò mò về mọi thứ.", "adj", "emotions"),
    ("confident", "💪", "tự tin", "He is confident in his skills.", "Anh ấy tự tin vào kỹ năng.", "adj", "emotions"),
    ("grateful", "🙏", "biết ơn", "I am grateful for your help.", "Tôi biết ơn sự giúp đỡ của bạn.", "adj", "emotions"),
    ("nervous", "😰", "lo lắng", "She feels nervous before exam.", "Cô ấy lo lắng trước kỳ thi.", "adj", "emotions"),
    ("patient", "🧘", "kiên nhẫn", "Be patient and wait.", "Hãy kiên nhẫn chờ đợi.", "adj", "emotions"),
    # clothes (5)
    ("scarf", "🧣", "khăn quàng", "Scarf keeps neck warm.", "Khăn quàng giữ ấm cổ.", "noun", "clothes"),
    ("belt", "🩴", "thắt lưng", "Belt holds pants up.", "Thắt lưng giữ quần.", "noun", "clothes"),
    ("sneakers", "👟", "giày thể thao", "Sneakers are good for running.", "Giày thể thao tốt cho chạy.", "noun", "clothes"),
    ("pajamas", "🩳", "đồ ngủ", "Pajamas are comfortable.", "Đồ ngủ thoải mái.", "noun", "clothes"),
    ("sweater", "🧥", "áo len", "Sweater is warm.", "Áo len ấm.", "noun", "clothes"),
    # actions (5)
    ("whisper", "🤫", "thì thầm", "Whisper in the library.", "Thì thầm trong thư viện.", "verb", "actions"),
    ("stretch", "🧘‍♂️", "vươn vai", "Stretch your arms.", "Vươn vai giãn tay.", "verb", "actions"),
    ("balance", "⚖️", "giữ thăng bằng", "Balance on one foot.", "Giữ thăng bằng bằng một chân.", "verb", "actions"),
    ("measure", "📏", "đo lường", "Measure the table length.", "Đo chiều dài bàn.", "verb", "actions"),
    ("celebrate", "🎉", "ăn mừng", "Celebrate your success.", "Ăn mừng thành công.", "verb", "actions"),
    # sports (5)
    ("badminton", "🏸", "cầu lông", "Badminton uses a shuttlecock.", "Cầu lông dùng quả cầu.", "noun", "sports"),
    ("wrestling", "🤼", "đấu vật", "Wrestling is a combat sport.", "Đấu vật là môn đối kháng.", "noun", "sports"),
    ("archery", "🏹", "bắn cung", "Archery needs a bow.", "Bắn cung cần cung tên.", "noun", "sports"),
    ("skiing", "⛷️", "trượt tuyết", "Skiing on snowy mountains.", "Trượt tuyết trên núi tuyết.", "noun", "sports"),
    ("marathon", "🏃", "chạy marathon", "Marathon is 42 kilometers.", "Marathon dài 42 km.", "noun", "sports"),
    # jobs (5)
    ("veterinarian", "🩺", "bác sĩ thú y", "Veterinarian treats animals.", "Bác sĩ thú y chữa cho động vật.", "noun", "jobs"),
    ("architect", "🏗️", "kiến trúc sư", "Architect designs buildings.", "Kiến trúc sư thiết kế tòa nhà.", "noun", "jobs"),
    ("journalist", "📰", "nhà báo", "Journalist writes news.", "Nhà báo viết tin tức.", "noun", "jobs"),
    ("librarian", "📚", "thủ thư", "Librarian organizes books.", "Thủ thư sắp xếp sách.", "noun", "jobs"),
    ("electrician", "⚡", "thợ điện", "Electrician fixes wiring.", "Thợ điện sửa dây điện.", "noun", "jobs"),
    # house (5)
    ("balcony", "🏠", "ban công", "Balcony is on the second floor.", "Ban công ở tầng hai.", "noun", "house"),
    ("basement", "🏚️", "tầng hầm", "Basement is underground.", "Tầng hầm ở dưới đất.", "noun", "house"),
    ("ceiling", "🏗️", "trần nhà", "Ceiling has a light.", "Trần nhà có đèn.", "noun", "house"),
    ("fence", "🪵", "hàng rào", "Fence surrounds the yard.", "Hàng rào quanh sân.", "noun", "house"),
    ("curtain", "🪟", "rèm cửa", "Curtain blocks sunlight.", "Rèm cửa chắn nắng.", "noun", "house"),
]

# ── Level 5 vocabulary (Advanced) ──────────────────────────────────────
# Target 76 new words to reach ~250 total (174 existing + 76 = 250)
LV5_WORDS = [
    # animals (7)
    ("armadillo", "🦔", "tatu", "Armadillo rolls into a ball.", "Tatu cuộn tròn.", "noun", "animals"),
    ("chameleon", "🦎", "tắc kè hoa", "Chameleon changes color.", "Tắc kè hoa đổi màu.", "noun", "animals"),
    ("octopus", "🐙", "bạch tuộc", "Octopus has eight tentacles.", "Bạch tuộc có tám xúc tu.", "noun", "animals"),
    ("scorpion", "🦂", "bọ cạp", "Scorpion has a stinger.", "Bọ cạp có nọc độc.", "noun", "animals"),
    ("swan", "🦢", "thiên nga", "Swan glides on the lake.", "Thiên nga lướt trên hồ.", "noun", "animals"),
    ("dragonfly", "🪰", "chuồn chuồn", "Dragonfly has transparent wings.", "Chuồn chuồn có cánh trong suốt.", "noun", "animals"),
    ("mosquito", "🦟", "muỗi", "Mosquito bites cause itching.", "Muỗi đốt gây ngứa.", "noun", "animals"),
    # food (7)
    ("quinoa", "🌾", "hạt diêm mạch", "Quinoa is a superfood.", "Hạt diêm mạch là siêu thực phẩm.", "noun", "food"),
    ("sushi", "🍣", "sushi", "Sushi has raw fish.", "Sushi có cá sống.", "noun", "food"),
    ("kimchi", "🥬", "kim chi", "Kimchi is fermented cabbage.", "Kim chi là cải thảo lên men.", "noun", "food"),
    ("croissant", "🥐", "bánh sừng bò", "Croissant is flaky and buttery.", "Bánh sừng bò xốp và béo.", "noun", "food"),
    ("burrito", "🌯", "burrito", "Burrito is wrapped in tortilla.", "Burrito gói trong bánh ngô.", "noun", "food"),
    ("curry", "🍛", "cà ri", "Curry has many spices.", "Cà ri có nhiều gia vị.", "noun", "food"),
    ("ramen", "🍜", "mì ramen", "Ramen is Japanese noodle soup.", "Ramen là mì Nhật.", "noun", "food"),
    # school (7)
    ("syllabus", "📋", "đề cương", "Syllabus outlines the course.", "Đề cương phác thảo khóa học.", "noun", "school"),
    ("internship", "💼", "thực tập", "Internship gives work experience.", "Thực tập cho kinh nghiệm làm việc.", "noun", "school"),
    ("dissertation", "📖", "luận án", "Dissertation is a long essay.", "Luận án là bài viết dài.", "noun", "school"),
    ("scholarship", "🎓", "học bổng (cao)", "She won a full scholarship.", "Cô ấy giành học bổng toàn phần.", "noun", "school"),
    ("dean", "👔", "trưởng khoa", "Dean manages the faculty.", "Trưởng khoa quản lý khoa.", "noun", "school"),
    ("alumni", "🎉", "cựu sinh viên", "Alumni attend the reunion.", "Cựu sinh viên dự hội ngộ.", "noun", "school"),
    ("faculty", "🏫", "đội ngũ giảng viên", "Faculty meets every month.", "Đội ngũ giảng viên họp hàng tháng.", "noun", "school"),
    # weather (6)
    ("humidity", "💧", "độ ẩm", "Humidity is high in summer.", "Độ ẩm cao vào mùa hè.", "noun", "weather"),
    ("atmosphere", "🌍", "khí quyển", "Atmosphere surrounds Earth.", "Khí quyển bao quanh Trái Đất.", "noun", "weather"),
    ("precipitation", "☔", "lượng mưa", "Precipitation includes rain and snow.", "Lượng mưa gồm mưa và tuyết.", "noun", "weather"),
    ("barometer", "📊", "phong vũ biểu", "Barometer measures air pressure.", "Phong vũ biểu đo áp suất không khí.", "noun", "weather"),
    ("dew", "💎", "sương", "Dew forms on grass in morning.", "Sương đọng trên cỏ buổi sáng.", "noun", "weather"),
    ("frost", "❄️", "sương muối", "Frost covers the ground.", "Sương muối phủ mặt đất.", "noun", "weather"),
    # nature (6)
    ("biodiversity", "🦋", "đa dạng sinh học", "Biodiversity means many species.", "Đa dạng sinh học có nhiều loài.", "noun", "nature"),
    ("conservation", "🌳", "bảo tồn", "Conservation protects wildlife.", "Bảo tồn bảo vệ động vật hoang dã.", "noun", "nature"),
    ("erosion", "🌪️", "xói mòn", "Erosion wears away soil.", "Xói mòn làm mất đất.", "noun", "nature"),
    ("ecosystem", "🌿", "hệ sinh thái", "Ecosystem includes all living things.", "Hệ sinh thái gồm mọi sinh vật.", "noun", "nature"),
    ("drought", "🏜️", "hạn hán", "Drought dries up rivers.", "Hạn hán làm khô sông.", "noun", "nature"),
    ("habitat", "🏡", "môi trường sống", "Habitat is where animals live.", "Môi trường sống là nơi động vật ở.", "noun", "nature"),
    # body (6)
    ("esophagus", "🫃", "thực quản", "Esophagus carries food to stomach.", "Thực quản đưa thức ăn xuống dạ dày.", "noun", "body"),
    ("trachea", "🫁", "khí quản", "Trachea carries air to lungs.", "Khí quản dẫn khí vào phổi.", "noun", "body"),
    ("diaphragm", "🧘", "cơ hoành", "Diaphragm helps you breathe.", "Cơ hoành giúp thở.", "noun", "body"),
    ("cartilage", "🦴", "sụn", "Cartilage cushions joints.", "Sụn đệm cho khớp.", "noun", "body"),
    ("lymph", "💉", "bạch huyết", "Lymph fights infection.", "Bạch huyết chống nhiễm trùng.", "noun", "body"),
    ("gland", "🧬", "tuyến", "Gland secretes hormones.", "Tuyến tiết hormone.", "noun", "body"),
    # emotions (5)
    ("compassion", "💗", "lòng trắc ẩn", "Compassion helps others.", "Lòng trắc ẩn giúp đỡ người khác.", "noun", "emotions"),
    ("perseverance", "💪", "sự kiên trì", "Perseverance leads to success.", "Sự kiên trì dẫn đến thành công.", "noun", "emotions"),
    ("humility", "🙇", "khiêm tốn", "Humility is a good quality.", "Khiêm tốn là phẩm chất tốt.", "noun", "emotions"),
    ("resilience", "🛡️", "khả năng phục hồi", "Resilience helps overcome hardship.", "Khả năng phục hồi giúp vượt qua khó khăn.", "noun", "emotions"),
    ("nostalgia", "🥹", "nỗi nhớ quá khứ", "Nostalgia makes me smile.", "Nỗi nhớ quá khứ làm tôi cười.", "noun", "emotions"),
    # clothes (5)
    ("cardigan", "🧶", "áo len cài khuy", "Cardigan buttons up the front.", "Áo len cài khuy có khuy phía trước.", "noun", "clothes"),
    ("blazer", "🧥", "áo khoác vest", "Blazer is formal wear.", "Áo khoác vest là trang phục lịch sự.", "noun", "clothes"),
    ("turtleneck", "🧣", "áo cổ lọ", "Turtleneck covers the neck.", "Áo cổ lọ che cổ.", "noun", "clothes"),
    ("overalls", "👖", "quần yếm", "Overalls are work clothes.", "Quần yếm là quần làm việc.", "noun", "clothes"),
    ("kimono", "👘", "kimono", "Kimono is Japanese traditional wear.", "Kimono là trang phục truyền thống Nhật.", "noun", "clothes"),
    # actions (5)
    ("negotiate", "🤝", "đàm phán", "They negotiate a contract.", "Họ đàm phán hợp đồng.", "verb", "actions"),
    ("prioritize", "📋", "ưu tiên", "Prioritize your tasks.", "Ưu tiên nhiệm vụ của bạn.", "verb", "actions"),
    ("elaborate", "📝", "trình bày chi tiết", "Elaborate on your idea.", "Trình bày chi tiết ý tưởng.", "verb", "actions"),
    ("collaborate", "👥", "cộng tác", "Teams collaborate on projects.", "Đội nhóm cộng tác trong dự án.", "verb", "actions"),
    ("brainstorm", "💡", "động não", "Brainstorm new ideas.", "Động não các ý tưởng mới.", "verb", "actions"),
    # sports (5)
    ("gymnastics", "🤸", "thể dục dụng cụ", "Gymnastics requires flexibility.", "Thể dục dụng cụ cần sự dẻo dai.", "noun", "sports"),
    ("fencing", "🤺", "đấu kiếm", "Fencing uses a sword.", "Đấu kiếm dùng kiếm.", "noun", "sports"),
    ("triathlon", "🏊", "ba môn phối hợp", "Triathlon combines three sports.", "Ba môn phối hợp kết hợp ba môn.", "noun", "sports"),
    ("weightlifting", "🏋️", "cử tạ", "Weightlifting builds strength.", "Cử tạ xây dựng sức mạnh.", "noun", "sports"),
    ("paragliding", "🪂", "dù lượn", "Paragliding flies over mountains.", "Dù lượn bay trên núi.", "noun", "sports"),
    # jobs (5)
    ("psychologist", "🧠", "nhà tâm lý học", "Psychologist studies behavior.", "Nhà tâm lý học nghiên cứu hành vi.", "noun", "jobs"),
    ("astronaut", "👨‍🚀", "phi hành gia", "Astronaut travels to space.", "Phi hành gia du hành vũ trụ.", "noun", "jobs"),
    ("pharmacist", "💊", "dược sĩ", "Pharmacist prepares medicine.", "Dược sĩ pha chế thuốc.", "noun", "jobs"),
    ("geologist", "⛰️", "nhà địa chất", "Geologist studies rocks.", "Nhà địa chất nghiên cứu đá.", "noun", "jobs"),
    ("anthropologist", "🌍", "nhà nhân chủng học", "Anthropologist studies human cultures.", "Nhà nhân chủng học nghiên cứu văn hóa loài người.", "noun", "jobs"),
    # house (5)
    ("attic", "🏠", "gác mái", "Attic is under the roof.", "Gác mái ở dưới mái nhà.", "noun", "house"),
    ("driveway", "🛣️", "đường vào nhà", "Driveway leads to the garage.", "Đường vào nhà dẫn ra gara.", "noun", "house"),
    ("porch", "🏡", "hiên nhà", "Porch has a rocking chair.", "Hiên nhà có ghế đu.", "noun", "house"),
    ("plumbing", "🔧", "hệ thống ống nước", "Plumbing carries water.", "Hệ thống ống nước dẫn nước.", "noun", "house"),
    ("thermostat", "🌡️", "bộ điều nhiệt", "Thermostat controls temperature.", "Bộ điều nhiệt kiểm soát nhiệt độ.", "noun", "house"),
    # fruits/veg/transport (5)
    ("pomegranate", "🍅", "lựu", "Pomegranate has many seeds.", "Lựu có nhiều hạt.", "noun", "fruits"),
    ("broccoli", "🥦", "bông cải xanh", "Broccoli is green.", "Bông cải xanh có màu xanh.", "noun", "vegetables"),
    ("artichoke", "🥬", "atisô", "Artichoke is a thistle plant.", "Atisô là cây có gai.", "noun", "vegetables"),
    ("tram", "🚊", "xe điện", "Tram runs on tracks.", "Xe điện chạy trên đường ray.", "noun", "transport"),
    ("rickshaw", "🛺", "xe kéo", "Rickshaw is pulled by a person.", "Xe kéo do người kéo.", "noun", "transport"),
]


def escape(val):
    esc = str(val).replace("\\", "\\\\").replace('"', '\\"')
    return esc

def main():
    start_id_lv4 = 1600  # Start after all existing IDs
    start_id_lv5 = start_id_lv4 + len(LV4_WORDS)

    lines = []

    # Generate TS code
    # Find the vocabulary array closing and insert new entries
    # Strategy: generate block to paste before the closing "];" of vocab
    
    blocks = []
    
    # Level 4 block
    blocks.append(f"\n  // ── Level 4 (Upper Intermediate) — added by seed-gen ───\n")
    for i, (word, emoji, vi, en_ex, vi_ex, pos, topic) in enumerate(LV4_WORDS):
        wid = start_id_lv4 + i
        blocks.append(f'  {{ id: {wid}, word: "{escape(word)}", meaning_vi: "{escape(vi)}", emoji: "{escape(emoji)}", topic: "{escape(topic)}", level: 4, example_en: "{escape(en_ex)}", example_vi: "{escape(vi_ex)}", part_of_speech: "{escape(pos)}" }},')
    
    # Level 5 block
    blocks.append(f"\n  // ── Level 5 (Advanced) — added by seed-gen ───\n")
    for i, (word, emoji, vi, en_ex, vi_ex, pos, topic) in enumerate(LV5_WORDS):
        wid = start_id_lv5 + i
        blocks.append(f'  {{ id: {wid}, word: "{escape(word)}", meaning_vi: "{escape(vi)}", emoji: "{escape(emoji)}", topic: "{escape(topic)}", level: 5, example_en: "{escape(en_ex)}", example_vi: "{escape(vi_ex)}", part_of_speech: "{escape(pos)}" }},')

    for block in blocks:
        print(block)

    print(f"\n// Total: {len(LV4_WORDS)} Level 4 + {len(LV5_WORDS)} Level 5 = {len(LV4_WORDS) + len(LV5_WORDS)} new words", file=sys.stderr)
    print(f"// Insert before the final '];' of the vocabulary array", file=sys.stderr)

if __name__ == "__main__":
    main()
