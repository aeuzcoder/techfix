import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techfix';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();

    await db.collection('problems').deleteMany({});
    await db.collection('advisors').deleteMany({});

    const now = new Date();

    const problems = [
      // ============= HARDWARE (20 ta) =============
      {
        name: { uz: "Noutbuk qizib ketyapti", ru: "Ноутбук перегревается", en: "Laptop overheating" },
        slug: "noutbuk-qizib-ketyapti",
        category: "hardware",
        subcategory: "Sovutish tizimi",
        viewCount: 154,
        steps: [
          { title: { uz: "Changlarni tozalash", ru: "Очистка от пыли", en: "Clean dust" }, description: { uz: "Noutbukni o'chirib, orqa qopqog'ini oching va ventilyatorni ehtiyotkorlik bilan tozalang. Siqilgan havo ballonchasi ishlatish tavsiya qilinadi.", ru: "Выключите ноутбук, откройте заднюю крышку и аккуратно очистите вентилятор.", en: "Turn off laptop, open the back panel and carefully clean the fan." } },
          { title: { uz: "Termopastani almashtirish", ru: "Замена термопасты", en: "Replace thermal paste" }, description: { uz: "Protsessor va video karta ustidagi eski termopastani tozalab, yangi sifatli termopasta suring.", ru: "Очистите старую и нанесите новую термопасту на процессор.", en: "Remove old thermal paste and apply new quality paste on CPU." } },
          { title: { uz: "Sovutish padi ishlatish", ru: "Использование охлаждающей подставки", en: "Use cooling pad" }, description: { uz: "Qo'shimcha sovutish uchun noutbuk ostiga sovutish padini qo'ying.", ru: "Используйте подставку для дополнительного охлаждения.", en: "Place a cooling pad under laptop for extra cooling." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Ekran yorib ketdi", ru: "Экран разбился", en: "Cracked screen" },
        slug: "ekran-yorib-ketdi",
        category: "hardware",
        subcategory: "Ekran",
        viewCount: 98,
        steps: [
          { title: { uz: "Tashqi monitor ulash", ru: "Подключить внешний монитор", en: "Connect external monitor" }, description: { uz: "HDMI yoki VGA kabel orqali tashqi monitorga ulab ishlating.", ru: "Используйте HDMI для подключения к внешнему монитору.", en: "Use HDMI or VGA to connect to external monitor." } },
          { title: { uz: "Ekranni almashtirish", ru: "Замена экрана", en: "Replace screen" }, description: { uz: "Servis markaziga yoki onlayn orqali yangi ekran buyurtma bering. Model raqamini tekshiring.", ru: "Закажите новый экран по модели ноутбука.", en: "Order a new screen matching your laptop model number." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Klaviatura ishlamayapti", ru: "Клавиатура не работает", en: "Keyboard not working" },
        slug: "klaviatura-ishlamayapti",
        category: "hardware",
        subcategory: "Kiritish qurilmalari",
        viewCount: 210,
        steps: [
          { title: { uz: "Drayverlarni tekshirish", ru: "Проверить драйверы", en: "Check drivers" }, description: { uz: "Device Manager → Keyboards bo'limiga kiring va drayverni qayta o'rnating.", ru: "Откройте диспетчер устройств и переустановите драйвер клавиатуры.", en: "Open Device Manager, go to Keyboards and reinstall driver." } },
          { title: { uz: "Tashqi klaviatura ulash", ru: "Подключить внешнюю клавиатуру", en: "Connect external keyboard" }, description: { uz: "USB tashqi klaviatura ulab koʻring. Agar ishlasa, ichki klaviatura noqulay.", ru: "Попробуйте подключить USB клавиатуру.", en: "Try connecting a USB keyboard to test." } },
          { title: { uz: "Kabel ulanishini tekshirish", ru: "Проверить кабельное соединение", en: "Check cable connection" }, description: { uz: "Noutbukning orqa qismini ochib, klaviatura kabelining mahkam ulanganligini tekshiring.", ru: "Откройте корпус и проверьте подключение кабеля клавиатуры.", en: "Open the laptop and check if keyboard cable is properly connected." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Batareya tez quvvat yo'qotadi", ru: "Батарея быстро разряжается", en: "Battery drains fast" },
        slug: "batareya-tez-quvvat-yoqotadi",
        category: "hardware",
        subcategory: "Batareya",
        viewCount: 320,
        steps: [
          { title: { uz: "Batareya holatini tekshirish", ru: "Проверить состояние батареи", en: "Check battery health" }, description: { uz: "CMD → powercfg /batteryreport buyrug'ini kiriting. Hisobotni tahlil qiling.", ru: "Выполните powercfg /batteryreport в командной строке.", en: "Run powercfg /batteryreport in CMD to analyze battery health." } },
          { title: { uz: "Quvvat sozlamalarini optimallashtirish", ru: "Оптимизировать настройки питания", en: "Optimize power settings" }, description: { uz: "Settings → Power → Battery saver rejimini yoqing. Ekran yorqinligini kamaytiring.", ru: "Включите режим экономии и уменьшите яркость.", en: "Enable battery saver mode and reduce screen brightness." } },
          { title: { uz: "Batareyani almashtirish", ru: "Замена батареи", en: "Replace battery" }, description: { uz: "Agar batareya 2-3 yildan oshgan bo'lsa, yangisiga almashtiring.", ru: "Если батарее более 2-3 лет, замените её.", en: "If battery is older than 2-3 years, replace it." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Ovoz chiqmayapti", ru: "Нет звука", en: "No sound output" },
        slug: "ovoz-chiqmayapti",
        category: "hardware",
        subcategory: "Audio",
        viewCount: 180,
        steps: [
          { title: { uz: "Ovoz balandligini tekshirish", ru: "Проверить громкость", en: "Check volume levels" }, description: { uz: "Tizim tray'da ovoz belgisiga bosib, Mute holatda emasligini tekshiring.", ru: "Проверьте не выключен ли звук в трее.", en: "Check system tray volume icon, make sure not muted." } },
          { title: { uz: "Audio drayverni yangilash", ru: "Обновить аудио драйвер", en: "Update audio driver" }, description: { uz: "Device Manager → Audio → Drayverni yangilash tugmasini bosing.", ru: "Обновите драйвер через диспетчер устройств.", en: "Update driver through Device Manager → Audio." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Wi-Fi ulanmayapti", ru: "Wi-Fi не подключается", en: "Wi-Fi not connecting" },
        slug: "wifi-ulanmayapti",
        category: "hardware",
        subcategory: "Tarmoq",
        viewCount: 415,
        steps: [
          { title: { uz: "Routerni qayta yoqish", ru: "Перезагрузить роутер", en: "Restart router" }, description: { uz: "Routerning quvvat kabelini 30 soniya o'chirib qayta yoqing.", ru: "Отключите роутер на 30 секунд и включите снова.", en: "Unplug router power for 30 seconds, then plug back in." } },
          { title: { uz: "Wi-Fi drayverni qayta o'rnatish", ru: "Переустановить Wi-Fi драйвер", en: "Reinstall Wi-Fi driver" }, description: { uz: "Device Manager → Network adapters → Wi-Fi adapterni o'chirib qayta o'rnating.", ru: "Переустановите драйвер через диспетчер устройств.", en: "Uninstall and reinstall Wi-Fi adapter driver." } },
          { title: { uz: "IP manzilni yangilash", ru: "Обновить IP адрес", en: "Renew IP address" }, description: { uz: "CMD → ipconfig /release → ipconfig /renew buyruqlarini kiriting.", ru: "Выполните ipconfig /release и ipconfig /renew.", en: "Run ipconfig /release then ipconfig /renew in CMD." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Kompyuter yoqilmayapti", ru: "Компьютер не включается", en: "Computer won't turn on" },
        slug: "kompyuter-yoqilmayapti",
        category: "hardware",
        subcategory: "Quvvat tizimi",
        viewCount: 540,
        steps: [
          { title: { uz: "Quvvat kabelini tekshirish", ru: "Проверить кабель питания", en: "Check power cable" }, description: { uz: "Kabelning rozetka va kompyuterga mahkam ulanganlilgini tekshiring.", ru: "Убедитесь в надёжности подключения кабеля.", en: "Ensure power cable is firmly connected to outlet and PC." } },
          { title: { uz: "CMOS batareykasini almashtirish", ru: "Замена батарейки CMOS", en: "Replace CMOS battery" }, description: { uz: "Ona platadagi CR2032 batareykani almashtirib ko'ring.", ru: "Замените батарейку CR2032 на материнской плате.", en: "Replace the CR2032 battery on motherboard." } },
          { title: { uz: "Blok pitaniyani tekshirish", ru: "Проверить блок питания", en: "Check PSU" }, description: { uz: "Boshqa ishlaydigan blok pitaniya bilan sinab ko'ring.", ru: "Попробуйте другой блок питания.", en: "Test with another known working power supply unit." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "RAM yetishmayapti", ru: "Не хватает оперативной памяти", en: "Low RAM issues" },
        slug: "ram-yetishmayapti",
        category: "hardware",
        subcategory: "Xotira",
        viewCount: 275,
        steps: [
          { title: { uz: "Task Manager orqali tekshirish", ru: "Проверить через диспетчер задач", en: "Check via Task Manager" }, description: { uz: "Ctrl+Shift+Esc → Performance → Memory bo'limida ishlatilishini tekshiring.", ru: "Проверьте использование через диспетчер задач.", en: "Check memory usage in Task Manager Performance tab." } },
          { title: { uz: "RAM qo'shish", ru: "Добавить RAM", en: "Add more RAM" }, description: { uz: "Noutbuk modelingizga mos DDR4/DDR5 RAM sotib oling va o'rnating.", ru: "Купите и установите дополнительную RAM.", en: "Buy compatible RAM module and install it." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Qattiq disk sekin ishlayapti", ru: "Жёсткий диск медленно работает", en: "Slow hard drive" },
        slug: "qattiq-disk-sekin",
        category: "hardware",
        subcategory: "Saqlash qurilmasi",
        viewCount: 190,
        steps: [
          { title: { uz: "Diskni defragmentatsiya qilish", ru: "Дефрагментация диска", en: "Defragment disk" }, description: { uz: "HDD uchun: Defragment and Optimize Drives dasturini ishga tushiring.", ru: "Запустите дефрагментацию для HDD.", en: "Run Defragment and Optimize Drives utility for HDD." } },
          { title: { uz: "SSD ga o'tish", ru: "Перейти на SSD", en: "Upgrade to SSD" }, description: { uz: "HDD ni SSD ga almashtiring — tezlik 5-10 barobar oshadi.", ru: "Замените HDD на SSD для значительного ускорения.", en: "Replace HDD with SSD for 5-10x speed improvement." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "USB port ishlamayapti", ru: "USB порт не работает", en: "USB port not working" },
        slug: "usb-port-ishlamayapti",
        category: "hardware",
        subcategory: "Portlar",
        viewCount: 145,
        steps: [
          { title: { uz: "Boshqa USB portni sinash", ru: "Попробовать другой порт", en: "Try another port" }, description: { uz: "Qurilmani kompyuterning boshqa USB portiga ulab ko'ring.", ru: "Подключите устройство к другому USB порту.", en: "Plug device into a different USB port." } },
          { title: { uz: "USB controller drayverni yangilash", ru: "Обновить USB драйвер", en: "Update USB driver" }, description: { uz: "Device Manager → Universal Serial Bus controllers → Drayverni yangilang.", ru: "Обновите драйвер через диспетчер устройств.", en: "Update driver in Device Manager → USB controllers." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Monitor rasm ko'rsatmayapti", ru: "Монитор не показывает изображение", en: "Monitor no display" },
        slug: "monitor-rasm-yoq",
        category: "hardware",
        subcategory: "Ekran",
        viewCount: 230,
        steps: [
          { title: { uz: "Kabelni tekshirish", ru: "Проверить кабель", en: "Check cable" }, description: { uz: "HDMI/VGA/DP kabelni qaytadan ulang yoki boshqa kabel bilan sinang.", ru: "Переподключите или замените кабель.", en: "Reconnect or try a different display cable." } },
          { title: { uz: "Video karta ulanishini tekshirish", ru: "Проверить видеокарту", en: "Check GPU connection" }, description: { uz: "Video kartani slotdan chiqarib qayta mahkam o'rnating.", ru: "Переустановите видеокарту в слот.", en: "Reseat the graphics card in its slot." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Sichqoncha ishlamayapti", ru: "Мышь не работает", en: "Mouse not working" },
        slug: "sichqoncha-ishlamayapti",
        category: "hardware",
        subcategory: "Kiritish qurilmalari",
        viewCount: 130,
        steps: [
          { title: { uz: "Batareykani tekshirish", ru: "Проверить батарейку", en: "Check battery" }, description: { uz: "Simsiz sichqoncha bo'lsa, batareykasini almashtiring.", ru: "Для беспроводной мыши замените батарейку.", en: "Replace batteries for wireless mouse." } },
          { title: { uz: "Boshqa portga ulash", ru: "Подключить к другому порту", en: "Try different port" }, description: { uz: "USB sichqonchani boshqa portga ulab ko'ring.", ru: "Попробуйте другой USB порт.", en: "Try connecting to a different USB port." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Printer chop etmayapti", ru: "Принтер не печатает", en: "Printer not printing" },
        slug: "printer-chop-etmayapti",
        category: "hardware",
        subcategory: "Tashqi qurilmalar",
        viewCount: 165,
        steps: [
          { title: { uz: "Printerni qayta yoqish", ru: "Перезагрузить принтер", en: "Restart printer" }, description: { uz: "Printerni o'chirib 30 soniyadan so'ng qayta yoqing.", ru: "Выключите принтер на 30 секунд.", en: "Turn off printer for 30 seconds then back on." } },
          { title: { uz: "Print navbatini tozalash", ru: "Очистить очередь печати", en: "Clear print queue" }, description: { uz: "Settings → Printers → Navbatdagi hujjatlarni bekor qiling.", ru: "Очистите очередь печати в настройках.", en: "Clear pending documents in printer settings." } },
          { title: { uz: "Drayverlarni qayta o'rnatish", ru: "Переустановить драйвер", en: "Reinstall drivers" }, description: { uz: "Printer ishlab chiqaruvchi saytidan eng yangi drayverni yuklab o'rnating.", ru: "Скачайте и установите драйвер с сайта производителя.", en: "Download latest driver from manufacturer website." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Noutbuk ekrani tirtillayapti", ru: "Экран мерцает", en: "Screen flickering" },
        slug: "ekran-tirtillayapti",
        category: "hardware",
        subcategory: "Ekran",
        viewCount: 175,
        steps: [
          { title: { uz: "Yangilanish chastotasini tekshirish", ru: "Проверить частоту обновления", en: "Check refresh rate" }, description: { uz: "Settings → Display → Advanced → Refresh rate to'g'ri tanlanganini tekshiring.", ru: "Проверьте правильность частоты обновления.", en: "Check that correct refresh rate is selected in Display settings." } },
          { title: { uz: "GPU drayverni yangilash", ru: "Обновить драйвер видеокарты", en: "Update GPU driver" }, description: { uz: "NVIDIA/AMD/Intel rasmiy saytidan yangi drayver yuklab o'rnating.", ru: "Скачайте новый драйвер с сайта производителя.", en: "Download and install latest GPU driver from manufacturer." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Quloqchin ishlamayapti", ru: "Наушники не работают", en: "Headphones not working" },
        slug: "quloqchin-ishlamayapti",
        category: "hardware",
        subcategory: "Audio",
        viewCount: 110,
        steps: [
          { title: { uz: "Audio chiqish portini tekshirish", ru: "Проверить аудиовыход", en: "Check audio output" }, description: { uz: "Taskbar → Sound → Output qurilmasini quloqchinga o'zgartiring.", ru: "Переключите вывод звука на наушники.", en: "Switch audio output device to headphones in sound settings." } },
          { title: { uz: "Boshqa qurilmada tekshirish", ru: "Проверить на другом устройстве", en: "Test on another device" }, description: { uz: "Quloqchinni telefon yoki boshqa kompyuterda sinab ko'ring.", ru: "Попробуйте на другом устройстве.", en: "Test headphones on phone or another computer." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Ventilator shovqin qilmoqda", ru: "Вентилятор шумит", en: "Fan making noise" },
        slug: "ventilator-shovqin",
        category: "hardware",
        subcategory: "Sovutish tizimi",
        viewCount: 195,
        steps: [
          { title: { uz: "Changlarni tozalash", ru: "Очистить от пыли", en: "Clean dust" }, description: { uz: "Ventilyator atrofidagi changlarni siqilgan havo bilan tozalang.", ru: "Очистите вентилятор сжатым воздухом.", en: "Clean fan area with compressed air." } },
          { title: { uz: "Ventilyatorni almashtirish", ru: "Заменить вентилятор", en: "Replace fan" }, description: { uz: "Tozalashdan keyin ham shovqin bo'lsa, ventilyatorni yangisiga almashtiring.", ru: "Если шум остаётся, замените вентилятор.", en: "If noise persists after cleaning, replace the fan." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Kamera ishlamayapti", ru: "Камера не работает", en: "Webcam not working" },
        slug: "kamera-ishlamayapti",
        category: "hardware",
        subcategory: "Tashqi qurilmalar",
        viewCount: 140,
        steps: [
          { title: { uz: "Maxfiylik sozlamalarini tekshirish", ru: "Проверить настройки конфиденциальности", en: "Check privacy settings" }, description: { uz: "Settings → Privacy → Camera → dasturlarga ruxsat bering.", ru: "Разрешите доступ к камере в настройках конфиденциальности.", en: "Allow camera access in Privacy settings." } },
          { title: { uz: "Drayverlarni yangilash", ru: "Обновить драйвер", en: "Update drivers" }, description: { uz: "Device Manager → Camera → drayverini yangilang.", ru: "Обновите драйвер камеры.", en: "Update camera driver in Device Manager." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Bluetooth ulanmayapti", ru: "Bluetooth не подключается", en: "Bluetooth not connecting" },
        slug: "bluetooth-ulanmayapti",
        category: "hardware",
        subcategory: "Tarmoq",
        viewCount: 200,
        steps: [
          { title: { uz: "Bluetooth yoqilganmi tekshirish", ru: "Проверить включён ли Bluetooth", en: "Check if Bluetooth is on" }, description: { uz: "Settings → Bluetooth → yoqing. Yoki Action Center orqali yoqing.", ru: "Включите Bluetooth в настройках.", en: "Enable Bluetooth in Settings or Action Center." } },
          { title: { uz: "Qurilmani qayta juftlash", ru: "Переподключить устройство", en: "Re-pair device" }, description: { uz: "Juftlangan qurilmani o'chirib, yangitdan juftlang.", ru: "Удалите устройство и подключите заново.", en: "Remove paired device and pair again." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Touchpad ishlamayapti", ru: "Тачпад не работает", en: "Touchpad not working" },
        slug: "touchpad-ishlamayapti",
        category: "hardware",
        subcategory: "Kiritish qurilmalari",
        viewCount: 160,
        steps: [
          { title: { uz: "Fn tugmasini tekshirish", ru: "Проверить кнопку Fn", en: "Check Fn key" }, description: { uz: "Fn + F6/F7/F9 (noutbukga qarab) tugmasini bosib touchpadni yoqing.", ru: "Нажмите Fn + F6/F7 для включения тачпада.", en: "Press Fn + F6/F7/F9 to toggle touchpad on." } },
          { title: { uz: "Drayverlarni tekshirish", ru: "Проверить драйвер", en: "Check drivers" }, description: { uz: "Device Manager → Mouse → Touchpad drayverini qayta o'rnating.", ru: "Переустановите драйвер тачпада.", en: "Reinstall touchpad driver in Device Manager." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Zaryadka olmayapti", ru: "Не заряжается", en: "Not charging" },
        slug: "zaryadka-olmayapti",
        category: "hardware",
        subcategory: "Quvvat tizimi",
        viewCount: 350,
        steps: [
          { title: { uz: "Zaryadka kabelini tekshirish", ru: "Проверить кабель зарядки", en: "Check charging cable" }, description: { uz: "Boshqa kabel yoki adapter bilan sinab ko'ring.", ru: "Попробуйте другой кабель или адаптер.", en: "Try a different charging cable or adapter." } },
          { title: { uz: "Portni tozalash", ru: "Очистить порт", en: "Clean port" }, description: { uz: "Zaryadka portidagi changni tishlash yordamida ehtiyotkorlik bilan tozalang.", ru: "Аккуратно очистите порт от пыли.", en: "Carefully clean dust from the charging port." } },
          { title: { uz: "Batareya sozlamalarini tekshirish", ru: "Проверить настройки батареи", en: "Check battery settings" }, description: { uz: "BIOS da batareya zaryadlash chegarasi cheklangan bo'lishi mumkin.", ru: "В BIOS может быть лимит заряда.", en: "BIOS may have battery charge limit enabled." } }
        ],
        createdAt: now, updatedAt: now,
      },

      // ============= SOFTWARE (20 ta) =============
      {
        name: { uz: "Windows ishga tushmayapti (Ko'k ekran)", ru: "Синий экран (BSOD)", en: "Windows BSOD" },
        slug: "windows-kok-ekran",
        category: "software",
        subcategory: "OS muammosi",
        viewCount: 302,
        steps: [
          { title: { uz: "Xavfsiz rejimga kirish", ru: "Безопасный режим", en: "Safe mode" }, description: { uz: "Kompyuterni yoqayotganda F8 tugmasini bosib yoki Settings → Recovery → Advanced startup orqali Xavfsiz rejimga kiring.", ru: "Войдите в безопасный режим через F8.", en: "Enter Safe Mode via F8 or Settings → Recovery → Advanced startup." } },
          { title: { uz: "Drayverlarni o'chirish", ru: "Удалить драйверы", en: "Remove drivers" }, description: { uz: "Xavfsiz rejimda oxirgi o'rnatilgan drayver yoki dasturlarni o'chiring.", ru: "Удалите последние драйверы в безопасном режиме.", en: "Remove recently installed drivers in Safe Mode." } },
          { title: { uz: "Tizimni qayta tiklash", ru: "Восстановление системы", en: "System restore" }, description: { uz: "System Restore orqali oldingi sog'lom holatga qaytaring.", ru: "Используйте восстановление системы.", en: "Use System Restore to revert to a previous working state." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Kompyuter sekin ishlayapti", ru: "Компьютер тормозит", en: "Slow computer" },
        slug: "kompyuter-sekin-ishlayapti",
        category: "software",
        subcategory: "Tizim optimizatsiyasi",
        viewCount: 580,
        steps: [
          { title: { uz: "Startup dasturlarni o'chirish", ru: "Отключить автозапуск", en: "Disable startup apps" }, description: { uz: "Task Manager → Startup → keraksiz dasturlarni Disable qiling.", ru: "Отключите ненужные программы в автозапуске.", en: "Disable unnecessary apps in Task Manager → Startup." } },
          { title: { uz: "Vaqtinchalik fayllarni tozalash", ru: "Очистить временные файлы", en: "Clear temp files" }, description: { uz: "Win+R → %temp% → barcha fayllarni o'chiring. Disk Cleanup ham ishlatish mumkin.", ru: "Выполните %temp% и удалите файлы. Или Disk Cleanup.", en: "Run %temp% and delete files. Also use Disk Cleanup." } },
          { title: { uz: "Viruslarni tekshirish", ru: "Проверить на вирусы", en: "Scan for viruses" }, description: { uz: "Windows Defender yoki boshqa antivirus bilan to'liq skanerlang.", ru: "Запустите полное сканирование антивирусом.", en: "Run a full scan with Windows Defender or other antivirus." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Dastur o'rnatilmayapti", ru: "Программа не устанавливается", en: "App won't install" },
        slug: "dastur-ornatilmayapti",
        category: "software",
        subcategory: "Dasturlar",
        viewCount: 120,
        steps: [
          { title: { uz: "Administrator sifatida ishga tushirish", ru: "Запуск от имени администратора", en: "Run as administrator" }, description: { uz: "O'rnatish fayliga o'ng tugma → Run as administrator bosing.", ru: "Щёлкните правой кнопкой → Запуск от администратора.", en: "Right-click installer → Run as administrator." } },
          { title: { uz: "Antivirusni vaqtincha o'chirish", ru: "Отключить антивирус", en: "Disable antivirus" }, description: { uz: "Antivirus o'rnatishni bloklayotgan bo'lishi mumkin. Vaqtincha o'chiring.", ru: "Антивирус может блокировать установку.", en: "Antivirus might block installation. Temporarily disable it." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Internet brauzeri sekin ishlayapti", ru: "Браузер тормозит", en: "Browser running slow" },
        slug: "brauzer-sekin",
        category: "software",
        subcategory: "Brauzer",
        viewCount: 290,
        steps: [
          { title: { uz: "Keshni tozalash", ru: "Очистить кеш", en: "Clear cache" }, description: { uz: "Ctrl+Shift+Delete → Cached images and files → Tozalash.", ru: "Ctrl+Shift+Delete → Очистить кеш.", en: "Press Ctrl+Shift+Delete → Clear cached images and files." } },
          { title: { uz: "Kengaytmalarni o'chirish", ru: "Отключить расширения", en: "Disable extensions" }, description: { uz: "Brauzer sozlamalari → Extensions → keraksizlarini o'chiring yoki Disable qiling.", ru: "Отключите ненужные расширения.", en: "Go to browser Extensions and disable unnecessary ones." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Virus topildi", ru: "Обнаружен вирус", en: "Virus detected" },
        slug: "virus-topildi",
        category: "software",
        subcategory: "Xavfsizlik",
        viewCount: 410,
        steps: [
          { title: { uz: "To'liq skanerlash", ru: "Полное сканирование", en: "Full scan" }, description: { uz: "Windows Security → Virus protection → Full scan bajaring.", ru: "Запустите полное сканирование Windows Security.", en: "Run Windows Security → Virus protection → Full scan." } },
          { title: { uz: "Malwarebytes ishlatish", ru: "Использовать Malwarebytes", en: "Use Malwarebytes" }, description: { uz: "Malwarebytes Anti-Malware dasturini yuklab, qo'shimcha skanerlash bajaring.", ru: "Скачайте и запустите Malwarebytes.", en: "Download and run Malwarebytes for additional scanning." } },
          { title: { uz: "Shubhali dasturlarni o'chirish", ru: "Удалить подозрительные программы", en: "Remove suspicious apps" }, description: { uz: "Settings → Apps → oxirgi o'rnatilgan notanish dasturlarni o'chiring.", ru: "Удалите недавно установленные подозрительные программы.", en: "Go to Settings → Apps and remove recently installed suspicious programs." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Windows yangilanmayapti", ru: "Windows не обновляется", en: "Windows Update failing" },
        slug: "windows-yangilanmayapti",
        category: "software",
        subcategory: "OS muammosi",
        viewCount: 220,
        steps: [
          { title: { uz: "Windows Update xizmatini qayta yoqish", ru: "Перезапустить службу обновления", en: "Restart update service" }, description: { uz: "services.msc → Windows Update → Restart bosing.", ru: "Перезапустите службу Windows Update.", en: "Open services.msc → Windows Update → Restart." } },
          { title: { uz: "Update troubleshooter ishlatish", ru: "Запустить средство устранения неполадок", en: "Run troubleshooter" }, description: { uz: "Settings → Troubleshoot → Windows Update troubleshooter ishlating.", ru: "Запустите средство устранения неполадок обновлений.", en: "Run Windows Update troubleshooter from Settings." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Dastur to'satdan yopiladi", ru: "Программа вылетает", en: "App crashes randomly" },
        slug: "dastur-yopiladi",
        category: "software",
        subcategory: "Dasturlar",
        viewCount: 185,
        steps: [
          { title: { uz: "Dasturni yangilash", ru: "Обновить программу", en: "Update app" }, description: { uz: "Dasturning oxirgi versiyasini ishlab chiqaruvchi saytidan yuklab o'rnating.", ru: "Установите последнюю версию программы.", en: "Download and install the latest version from developer site." } },
          { title: { uz: "Moslikni tekshirish", ru: "Проверить совместимость", en: "Check compatibility" }, description: { uz: "Dasturga o'ng tugma → Properties → Compatibility → Windows versiyasini tanlang.", ru: "Запустите в режиме совместимости.", en: "Right-click app → Properties → Compatibility → Select OS version." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Xotirada joy qolmadi", ru: "Нет места на диске", en: "Disk space full" },
        slug: "xotirada-joy-yoq",
        category: "software",
        subcategory: "Tizim optimizatsiyasi",
        viewCount: 330,
        steps: [
          { title: { uz: "Katta fayllarni topish", ru: "Найти большие файлы", en: "Find large files" }, description: { uz: "WinDirStat yoki TreeSize dasturi orqali katta fayllarni toping.", ru: "Используйте WinDirStat для поиска больших файлов.", en: "Use WinDirStat or TreeSize to find large files." } },
          { title: { uz: "Disk Cleanup ishlatish", ru: "Очистка диска", en: "Run Disk Cleanup" }, description: { uz: "Disk Cleanup → System files → Windows Update cache va boshqalarni tozalang.", ru: "Используйте очистку диска включая системные файлы.", en: "Run Disk Cleanup including system files to free space." } },
          { title: { uz: "Keraksiz dasturlarni o'chirish", ru: "Удалить ненужные программы", en: "Uninstall unused apps" }, description: { uz: "Settings → Apps → ishlatilmaydigan dasturlarni o'chiring.", ru: "Удалите неиспользуемые программы.", en: "Remove unused applications from Settings → Apps." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Parol esdan chiqdi", ru: "Забыл пароль", en: "Forgot password" },
        slug: "parol-esdan-chiqdi",
        category: "software",
        subcategory: "Xavfsizlik",
        viewCount: 450,
        steps: [
          { title: { uz: "Microsoft hisob orqali tiklash", ru: "Сброс через учётную запись Microsoft", en: "Reset via Microsoft account" }, description: { uz: "account.live.com saytiga kirib parolni tiklang.", ru: "Сбросьте пароль на account.live.com.", en: "Go to account.live.com to reset your password." } },
          { title: { uz: "Windows USB orqali tiklash", ru: "Сброс через USB", en: "Reset via USB" }, description: { uz: "Windows o'rnatish USB dan yuklang → Repair → CMD → net user buyrug'i.", ru: "Загрузитесь с установочного USB.", en: "Boot from Windows install USB → Repair → CMD → net user command." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Ekran o'lchamlar noto'g'ri", ru: "Неправильное разрешение экрана", en: "Wrong screen resolution" },
        slug: "ekran-olchamlari-notogri",
        category: "software",
        subcategory: "Ekran sozlamalari",
        viewCount: 95,
        steps: [
          { title: { uz: "Display sozlamalarini ochish", ru: "Открыть настройки дисплея", en: "Open display settings" }, description: { uz: "Desktop → o'ng tugma → Display settings → Resolution → Recommended tanlang.", ru: "Выберите рекомендуемое разрешение.", en: "Right-click desktop → Display settings → Select Recommended resolution." } },
          { title: { uz: "GPU drayverni yangilash", ru: "Обновить драйвер видеокарты", en: "Update GPU driver" }, description: { uz: "To'g'ri o'lcham chiqmasa, GPU drayverini yangilang.", ru: "Обновите драйвер если разрешение не доступно.", en: "Update GPU driver if correct resolution is not available." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Fayllar yo'qoldi", ru: "Файлы пропали", en: "Files disappeared" },
        slug: "fayllar-yoqoldi",
        category: "software",
        subcategory: "Ma'lumotlarni tiklash",
        viewCount: 260,
        steps: [
          { title: { uz: "Axlat qutisini tekshirish", ru: "Проверить корзину", en: "Check Recycle Bin" }, description: { uz: "Recycle Bin ni oching — fayllar shu yerda bo'lishi mumkin.", ru: "Проверьте корзину на наличие файлов.", en: "Open Recycle Bin — files might be there." } },
          { title: { uz: "Recuva dasturi bilan tiklash", ru: "Восстановить через Recuva", en: "Recover with Recuva" }, description: { uz: "Recuva dasturini yuklab, o'chirilgan fayllarni qidiring va tiklang.", ru: "Скачайте Recuva и восстановите файлы.", en: "Download Recuva and scan for deleted files to recover." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Tizimda xato xabar chiqmoqda", ru: "Ошибки в системе", en: "System error messages" },
        slug: "tizim-xato-xabar",
        category: "software",
        subcategory: "OS muammosi",
        viewCount: 175,
        steps: [
          { title: { uz: "SFC skanerlash", ru: "Сканирование SFC", en: "SFC scan" }, description: { uz: "CMD Administrator → sfc /scannow buyrug'ini kiriting va kutib turing.", ru: "Запустите sfc /scannow от имени администратора.", en: "Open CMD as admin → run sfc /scannow and wait." } },
          { title: { uz: "DISM ishlatish", ru: "Запустить DISM", en: "Run DISM" }, description: { uz: "CMD → DISM /Online /Cleanup-Image /RestoreHealth buyrug'ini bajaring.", ru: "Выполните DISM /RestoreHealth.", en: "Run DISM /Online /Cleanup-Image /RestoreHealth in CMD." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Excel/Word ochilmayapti", ru: "Excel/Word не открывается", en: "Excel/Word won't open" },
        slug: "office-ochilmayapti",
        category: "software",
        subcategory: "Dasturlar",
        viewCount: 135,
        steps: [
          { title: { uz: "Office ni ta'mirlash", ru: "Восстановить Office", en: "Repair Office" }, description: { uz: "Settings → Apps → Microsoft Office → Modify → Quick Repair bosing.", ru: "Выберите восстановление Office в настройках.", en: "Go to Settings → Apps → Microsoft Office → Modify → Quick Repair." } },
          { title: { uz: "Qayta o'rnatish", ru: "Переустановить", en: "Reinstall" }, description: { uz: "Office ni to'liq o'chirib, yangitdan o'rnating.", ru: "Полностью удалите и переустановите Office.", en: "Completely uninstall and reinstall Microsoft Office." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Brauzerda reklama ko'p chiqmoqda", ru: "Много рекламы в браузере", en: "Too many ads in browser" },
        slug: "brauzer-reklama",
        category: "software",
        subcategory: "Brauzer",
        viewCount: 380,
        steps: [
          { title: { uz: "AdBlock o'rnatish", ru: "Установить AdBlock", en: "Install AdBlock" }, description: { uz: "Chrome/Firefox kengaytmalar do'konidan uBlock Origin ni o'rnating.", ru: "Установите uBlock Origin из магазина расширений.", en: "Install uBlock Origin from browser extension store." } },
          { title: { uz: "Adware ni tozalash", ru: "Очистить рекламное ПО", en: "Remove adware" }, description: { uz: "Malwarebytes bilan skanerlang — shubhali kengaytmalarni o'chiring.", ru: "Просканируйте Malwarebytes и удалите подозрительные расширения.", en: "Scan with Malwarebytes and remove suspicious extensions." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Dastur tili o'zgarmayapti", ru: "Не меняется язык программы", en: "App language won't change" },
        slug: "dastur-tili-ozgarmayapti",
        category: "software",
        subcategory: "Sozlamalar",
        viewCount: 75,
        steps: [
          { title: { uz: "Tizim tilini tekshirish", ru: "Проверить язык системы", en: "Check system language" }, description: { uz: "Settings → Time & Language → Language → kerakli tilni qo'shing.", ru: "Проверьте и добавьте нужный язык в настройках.", en: "Go to Settings → Language and add the required language." } },
          { title: { uz: "Dastur sozlamalaridan o'zgartirish", ru: "Изменить в настройках программы", en: "Change in app settings" }, description: { uz: "Ko'p dasturlarda Settings/Preferences bo'limida til almashtirgich bor.", ru: "В настройках программы есть переключатель языка.", en: "Most apps have a language switcher in Settings/Preferences." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "VPN ishlamayapti", ru: "VPN не работает", en: "VPN not working" },
        slug: "vpn-ishlamayapti",
        category: "software",
        subcategory: "Tarmoq",
        viewCount: 310,
        steps: [
          { title: { uz: "Boshqa server tanlash", ru: "Выбрать другой сервер", en: "Select different server" }, description: { uz: "VPN dasturidagi serverlar ro'yxatidan boshqa mamlakatni tanlang.", ru: "Выберите другую страну в списке серверов VPN.", en: "Choose a different country from the VPN server list." } },
          { title: { uz: "DNS ni tozalash", ru: "Очистить DNS", en: "Flush DNS" }, description: { uz: "CMD → ipconfig /flushdns buyrug'ini karang va brauzer keshini tozalang.", ru: "Выполните ipconfig /flushdns.", en: "Run ipconfig /flushdns in CMD and clear browser cache." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "O'yin sekin ishlayapti (FPS past)", ru: "Игра тормозит (низкий FPS)", en: "Game low FPS" },
        slug: "oyin-sekin-fps",
        category: "software",
        subcategory: "O'yinlar",
        viewCount: 420,
        steps: [
          { title: { uz: "Grafika sozlamalarini pasaytirish", ru: "Снизить графику", en: "Lower graphics settings" }, description: { uz: "O'yin sozlamalarida Resolution, Shadows, Textures ni Low/Medium ga qo'ying.", ru: "Установите графику на низкий/средний уровень.", en: "Set Resolution, Shadows, Textures to Low/Medium in game settings." } },
          { title: { uz: "GPU drayverlarini yangilash", ru: "Обновить драйвер видеокарты", en: "Update GPU drivers" }, description: { uz: "NVIDIA GeForce Experience yoki AMD Radeon Software orqali yangilang.", ru: "Обновите через GeForce Experience или AMD.", en: "Update via NVIDIA GeForce Experience or AMD Radeon Software." } },
          { title: { uz: "Fon dasturlarini yopish", ru: "Закрыть фоновые программы", en: "Close background apps" }, description: { uz: "O'yin vaqtida brauzer va boshqa og'ir dasturlarni yoping.", ru: "Закройте браузер и другие программы.", en: "Close browser and other resource-heavy apps while gaming." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Windows faollashtirilmagan", ru: "Windows не активирована", en: "Windows not activated" },
        slug: "windows-faollashtirish",
        category: "software",
        subcategory: "OS muammosi",
        viewCount: 270,
        steps: [
          { title: { uz: "Litsenziya kalitini kiritish", ru: "Ввести ключ лицензии", en: "Enter license key" }, description: { uz: "Settings → Activation → Change product key → kalitni kiriting.", ru: "Введите ключ продукта в настройках активации.", en: "Go to Settings → Activation → Change product key." } },
          { title: { uz: "Raqamli litsenziyani ulash", ru: "Привязать цифровую лицензию", en: "Link digital license" }, description: { uz: "Microsoft hisobga kiring va qurilmani ulang — avtomatik faollashadi.", ru: "Войдите в учётную запись Microsoft.", en: "Sign in to Microsoft account to link digital license." } }
        ],
        createdAt: now, updatedAt: now,
      },
      {
        name: { uz: "Tizim qayta yoqilishi to'xtamayapti", ru: "Перезагрузка не прекращается", en: "Endless restart loop" },
        slug: "tizim-qayta-yoqilish",
        category: "software",
        subcategory: "OS muammosi",
        viewCount: 195,
        steps: [
          { title: { uz: "Xavfsiz rejimga kirish", ru: "Войти в безопасный режим", en: "Enter Safe Mode" }, description: { uz: "3 marta o'chirib yondirib WinRE ga kiring → Troubleshoot → Safe Mode.", ru: "Войдите в WinRE через 3 перезагрузки.", en: "Force WinRE by 3 restarts → Troubleshoot → Safe Mode." } },
          { title: { uz: "Ohirgi yangilanishni o'chirish", ru: "Удалить последнее обновление", en: "Uninstall last update" }, description: { uz: "Safe mode → Settings → Windows Update → Update history → Uninstall.", ru: "Удалите последнее обновление в безопасном режиме.", en: "In Safe Mode: Settings → Windows Update → Uninstall recent update." } }
        ],
        createdAt: now, updatedAt: now,
      },
    ];

    const resultProbs = await db.collection('problems').insertMany(problems);
    console.log(`${resultProbs.insertedCount} problems inserted`);

    // Advisors
    const advisors = [
      {
        name: "Sardor Yo'ldoshev",
        email: "sardor@example.com",
        specialization: ["Hardware", "Apple", "Windows"],
        rating: 4.9,
        reviewCount: 124,
        isAvailable: true,
        createdAt: now, updatedAt: now,
      },
      {
        name: "Jamshid Aliyev",
        email: "jamshid@example.com",
        specialization: ["Software", "Linux", "Tarmoqlar"],
        rating: 4.7,
        reviewCount: 89,
        isAvailable: true,
        createdAt: now, updatedAt: now,
      },
      {
        name: "Nodir Karimov",
        email: "nodir@example.com",
        specialization: ["Hardware", "Server", "Tarmoqlar"],
        rating: 4.8,
        reviewCount: 67,
        isAvailable: true,
        createdAt: now, updatedAt: now,
      },
      {
        name: "Aziza Toshpulatova",
        email: "aziza@example.com",
        specialization: ["Software", "Windows", "Office"],
        rating: 4.6,
        reviewCount: 45,
        isAvailable: true,
        createdAt: now, updatedAt: now,
      },
    ];

    const resultAdvisors = await db.collection('advisors').insertMany(advisors);
    console.log(`${resultAdvisors.insertedCount} advisors inserted`);

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await client.close();
    console.log('Done. Disconnected.');
  }
}

seed();
