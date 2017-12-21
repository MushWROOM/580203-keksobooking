'use strict';
var avatars = ['01', '02', '03', '04', '05', '06', '07', '08'];
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var checkInOut = ['12:00', '13:00', '14:00'];
var allFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var getFeatures = function (features) {
  var randomFeatures = sattoloRandomise(features);
  return randomFeatures.slice(0, getRandomNumber(0, 5));
};
var getRandomNumber = function (min, max) {
  return (Math.floor((Math.random() * (max - min)) + min));
};
var sattoloRandomise = function (block) {
  var replace = 0;
  var i = block.length;
  var j = 0;
  while (i > 1) {
    i--;
    j = getRandomNumber(0, i - 1);
    replace = block[j];
    block[j] = block[i];
    block[i] = replace;
  }
  return block;
};
var getType = function (numberOfType) {
  if (numberOfType === 0) {
    return 'Квартира';
  } else if (numberOfType === 1) {
    return 'Дом';
  } else {
    return 'Бунгало';
  }
};
var createAd = function (avatarAd, titleAd, checkInOutAd, allFeaturesAd) {
  var advertisements = [];
  var randomAvatars = sattoloRandomise(avatarAd);
  var randomTitles = sattoloRandomise(titleAd);
  for (var i = 0; i < 8; i++) {
    var locationX = getRandomNumber(300, 900);
    var locationY = getRandomNumber(100, 500);
    var advertisementAvatar = randomAvatars.pop();
    var advertisementTitle = randomTitles.pop();
    var advertisemenAddress = locationX + ', ' + locationY;
    var advertisementPrice = getRandomNumber(1000, 1000000);
    var advertisementType = getRandomNumber(0, 2);
    var advertisementRoom = getRandomNumber(1, 5);
    var advertisementGuests = getRandomNumber(1, 30);
    var advertisementCheckIn = getRandomNumber(0, 2);
    var advertisementCheckOut = getRandomNumber(0, 2);
    var advertisementFeatures = getFeatures(allFeaturesAd);
    advertisements[i] = {
      author: {
        avatar: 'img/avatars/user' + advertisementAvatar + '.png',
      },
      offer: {
        title: advertisementTitle,
        address: advertisemenAddress,
        price: advertisementPrice,
        type: getType[advertisementType],
        rooms: advertisementRoom,
        guests: advertisementGuests,
        checkin: checkInOutAd[advertisementCheckIn],
        checkout: checkInOutAd[advertisementCheckOut],
        features: advertisementFeatures,
        description: '',
        photos: []
      },
      adLocation: {
        x: locationX,
        y: locationY
      }
    };
  }
  return advertisements;
};
var bookingTemplate = document.querySelector('template').content;
var bookingElement = bookingTemplate.querySelector('.map__card').cloneNode(true);
var doesFeatureExist = function (someFeatures) {
  var listOfFeatures = document.querySelectorAll('.feature');
  for (var i = 0; i < listOfFeatures.length; i++) {
	  listOfFeatures[i].classList.add('hidden')
    for (var j = 0; j < someFeatures.offer.features.length; j++) {
      var existence = 0;
      if (listOfFeatures[i].classList.contains('.feature--' + someFeatures.offer.features[j])) {
        existence++;
      }
    }
    if (existence === 1) {
      listOfFeatures[i].classList.remove('hidden');
    }
  }
};
document.querySelector('.map').classList.remove('.map--faded');
var placeButton = document.querySelector('.map__pins');
var createButton = function (buttonData) {
  var buttonTemplate = document.createElement('button');
  buttonTemplate.className = 'map__pin';
  buttonTemplate.style.left = buttonData.adLocation.x + 'px';
  buttonTemplate.style.top = buttonData.adLocation.y + 'px';
  var imgTemplate = document.createElement('img');
  imgTemplate.setAttribute('width', 40);
  imgTemplate.setAttribute('height', 40);
  imgTemplate.setAttribute('draggable', false);
  imgTemplate.setAttribute('src', buttonData.author.avatar);
  buttonTemplate.appendChild(imgTemplate);
  return buttonTemplate;
};
var appendFragment = function (buttonData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < buttonData.length; i++) {
    fragment.appendChild(createButton(buttonData[i]));
  }
  return fragment;
};
var buttons = createAd(avatars, titles, checkInOut, allFeatures);
var bookingInfo = function (bookingData) {
  bookingElement.querySelector('h3').textContent = bookingData.offer.title;
  bookingElement.querySelector('small').textContent = bookingData.offer.address;
  bookingElement.querySelector('.popup__price').textContent = bookingData.offer.price + '&#x20bd;/ночь';
  bookingElement.querySelector('h4').textContent = bookingData.offer.type;
  var allP = bookingElement.querySelectorAll('p');
  allP[allP.length - 3].textContent = bookingData.offer.rooms + ' для ' + bookingData.offer.guests + ' гостей';
  allP[allP.length - 2].textContent = 'Заезд после ' + bookingData.offer.checkin + ', выезд до ' + bookingData.offer.checkout;
  doesFeatureExist(bookingData);
  allP[allP.length - 1].textContent = bookingData.offer.description;
  bookingElement.querySelector('.popup__avatar').setAttribute('src', bookingData.author.avatar);
  
  return bookingElement;
};
placeButton.appendChild(appendFragment(buttons));
document.querySelector('.map').insertBefore(bookingInfo(buttons[0]), document.querySelector('.map__filters-container'));
