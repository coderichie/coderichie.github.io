$(document).ready(function () {
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method 
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }


  $('footer').on('click', 'button', function () {
    if ($(this).attr('type') === 'submit') {
      return;
    }
    window.scrollTo(0,0);
    let currentstep = document.querySelector('.currentstep');
    currentstep.classList.remove('currentstep');
    currentstep.classList.add('masked');
    let stepper = document.querySelector('.active');
    stepper.classList.remove('active');
    document.getElementById('back').classList.remove('masked');
    if ($(this).attr('id') === 'next') {
      currentstep.nextElementSibling.classList.add('currentstep');
      currentstep.nextElementSibling.classList.remove('masked');
      stepper.nextElementSibling.nextElementSibling.classList.add('active');
      stepper.classList.add('completed');
      if (currentstep.id === 'step2') {
        $('.next-button-wrapper').html('<button id="next" class="button primary" type="submit">Submit Request</button>')
      }
      if (currentstep.nextElementSibling.getAttribute('data-status') != 'complete' && !$('#lockconfig').attr('value')) {
        $('#next').attr('disabled', 'true')
      }
    } else if ($(this).attr('id') === 'back') {
      currentstep.previousElementSibling.classList.add('currentstep');
      currentstep.previousElementSibling.classList.remove('masked');
      stepper.previousElementSibling.previousElementSibling.classList.remove('completed')
      stepper.previousElementSibling.previousElementSibling.classList.add('active')
      if (currentstep.id === 'step2') {
        document.getElementById('back').classList.add('masked');
      } else if (currentstep.id === 'step3') {
        $('.next-button-wrapper').html('<button  id="next" class="button primary" type="button">Next <i class="icon_arrow-right"></i></button>')
      }
      $('#next').removeAttr('disabled')
    }
  })

  $('#lockconfig').on('change', function () {
    if ($('#lockconfig').val() === "Create Sets of Locks that are Keyed Alike") {
      $('#keyed-alike-sets').removeClass('masked');
      $('#summary').removeClass('masked')
    } else if ($('#lockconfig').val() === 'Leave Locks Keyed As Is' || $('#lockconfig').val() === 'Key Each Lock Uniquely') {
      $('#uniquely-key-confirm').removeClass('masked');
      $('#keyed-alike-sets').attr('class', 'masked');
      $('#summary').attr('class', 'masked');
    } else {
      $('#keyed-alike-sets').attr('class', 'masked');
      $('#uniquely-key-confirm').attr('class', 'masked')
      $('#summary').attr('class', 'masked')
    }
    $('#lockconfig').val() ? $('#next').removeAttr('disabled') : $('#next').attr('disabled', 'true');


  })

  $('form').on('keyup', function () {
    let regex = /\d{4}/
    if ($('.currentstep').attr('id') === 'step1' && $('#LDAP').val() && $('#store').val() && $('#esvs').val() && regex.test($('#store').val())) {
      $('#next').removeAttr('disabled');
      $('.currentstep').attr('data-status', 'complete')
    } else if ($('.currentstep').attr('id') === 'step2' && $('#street').val() && $('#city').val() && $('#state').val() && $('#county').val()
      && $('#zip').val() && $('#workphone').val().length === 16 && $('#homephone').val().length === 16) {
      $('#next').removeAttr('disabled');
      $('.currentstep').attr('data-status', 'complete')
    }
  })

  $('#masterkey').on('change', function () {
    if (document.getElementById('masterkey').checked) {
      $('#master-key-confirm').removeClass('masked');
      $('#summary-master-key').text('Master Key Across All Locks in Order');
    } else {
      $('#master-key-confirm').addClass('masked')
      $('#summary-master-key').text('No Master Key')
    }
  })
  $('#remainder-key-unique').on('change', function () {
    if (document.getElementById('remainder-key-unique').checked) {
      $('#uniquely-key-confirm').removeClass('masked');
      $('#summary-remaining-locks').text('Remaining Locks Keyed Uniquely')
    } else {
      $('#uniquely-key-confirm').addClass('masked')
      $('#summary-remaining-locks').text('Leave Remaining Locks as is')
    }
  })

  document.getElementById('store').addEventListener("input", function () {
    if (this.value.length == this.getAttribute('maxlength')) {
      document.getElementById('esvs').focus();
    }
  })
  var inputs = Array.from(document.querySelectorAll('input'));
  inputs.forEach(function (e) {
    e.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    })
  })

  $('body').on('click', '.addlineitems', function () {
    let newRow = "<div class=\"lineitemrow\"> <input type=\"hidden\" name=\"00Nm0000002E3KZ\" value=\"" + $(this).attr('data-id') + "\"> <input class=\"lineitemnumber\" name=\"00Nm0000002E0dt\" size=\"20\" type=\"text\" required=\"true\"/> <input class=\"lineitemquantity\" name=\"00Nm0000002E0du\" size=\"10\" type=\"number\" value=\"0\" required=\"true\"/> <button class=\"button secondary sm removelineitems\" type=\"button\"><i class=\"icon_minus\"></i></button></div>";
    let disabledRow = $(this).parent().html();
    $(this).parent().html(newRow);
    let newDisabledRow = $('<div>').addClass('lineitemrow').html(disabledRow);
    $('.lineitemcolumn' + $(this).attr('data-id')).append(newDisabledRow);

  })

  $('body').on('click', '.removelineitems', function () {
    $(this).parent().remove();
    updateSummary();
  })

  var lockSetNumber = 1;
  $('#addlockset').on('click', function () {
    lockSetNumber++;
    let newLockset = "<div id=\"lock-set-" + lockSetNumber + "\" data-id=\"" + lockSetNumber + "\"><div class=\"column\"><div class=\"row\"><header><h3 class=\"locksetheading\">Keyed Alike Lock Set ".concat(lockSetNumber, "</h3><p>Which locks need to be keyed alike?</p></header></div></div><div class=\"lineitemdetails\"><div class=\"column lineitemcolumn").concat(lockSetNumber, "\"><div class=\"lineitemrow\"><div class=\"lineitemnumber\">Order Line Item Number</div><div class=\"lineitemquantity\">Quantity for This Set</div></div><div class=\"lineitemrow\"><input type=\"hidden\" name=\"00Nm0000002E3KZ\" value=\"").concat(lockSetNumber, "\"><input class=\"lineitemnumber\" placeholder=\"Ex. SO101\" name=\"00Nm0000002E0dt\"size=\"20\" type=\"text\" required=\"true\"/> <input class=\"lineitemquantity\" placeholder=\"Ex. 4\" name=\"00Nm0000002E0du\"size=\"10\" value=\"0\" type=\"number\" min=\"0\" required=\"true\" /></div><div class=\"lineitemrow\"><input class=\"disabledtextbox lineitemnumber\" disabled=\"true\" /> <input class=\"disabledtextbox lineitemquantity\" size=\"10\" disabled=\"true\" /> <button class=\"button primary sm addlineitems\" type=\"button\" data-id=\"").concat(lockSetNumber, "\"><i class=\"icon_plus\"></i></button></div></div></div><div class=\"column\"><div class=\"row\"><label for=\"key-quantity-").concat(lockSetNumber, "\">Total Number of Key Copies Needed</label></div><div class=\"row\"><div class=\"input-group\"><input class=\"key-quantity-").concat(lockSetNumber, "\" name=\"00Nm0000002E0dr\" size=\"10\" type=\"number\" value=\"0\" min=\"0\" required=\"true\" /></div></div></div><div class=\"column\"><div class=\"secondary-control-container row\"><input id=\"dnd-lockset-").concat(lockSetNumber, "\" name=\"00Nm0000002E0do\" type=\"checkbox\" value=\"1\" /><label for=\"dnd-lockset-").concat(lockSetNumber, "\"><span class=\"check-square\"><span></span></span>Stamp \"Do Not Duplicate\" on Keys</label><button class=\"button secondary sm removelockset\" type=\"button\" data-id=\"").concat(lockSetNumber, "\">Remove This Set</button></div></div><hr></div>");
    $('#real-locksets').append(newLockset);
    $('#phantom-heading').text('Keyed Alike Lock Set ' + (lockSetNumber + 1));
    updateSummary();
  })

  $('body').on('click', '.removelockset', function () {
    lockSetNumber--;
    let deleteNumber = $(this).attr('data-id');
    $('#lock-set-' + deleteNumber).remove();
    let lockSetHeadings = Array.from(document.querySelectorAll('.locksetheading'));
    lockSetHeadings.forEach(function (e, index) {
      e.textContent = 'Keyed Alike Lock Set ' + (index + 1);
    })
    $('#phantom-heading').text('Keyed Alike Lock Set ' + (lockSetNumber + 1));
    updateSummary();
  })

  $('body').on('change', 'input', updateSummary)

  function updateSummary() {
    const summary = {};
    let sum = 0;
    $('#summary-sets').empty();
    let setNumbers = Array.from(document.getElementsByName('00Nm0000002E3KZ'));
    let quantities = Array.from(document.getElementsByName('00Nm0000002E0du'));
    let keyQuantities = Array.from(document.getElementsByName('00Nm0000002E0dr'));
    setNumbers.forEach(function (e, index) {
      if (summary[e.value] > -1) {
        summary[e.value] += parseInt(quantities[index].value);
      } else { summary[e.value] = parseInt(quantities[index].value); }
    });
    Object.keys(summary).forEach(function (e, index) {
      $('#summary-sets').append('<p>Set ' + e + ': ' + summary[e] + ' Locks Keyed Alike, ' + keyQuantities[index].value + ' Key Copies </p>');
    })
    for (let nums in summary) {
      sum += summary[nums];
    }
    $('#summary-total').text('Total Number of Locks Keyed: ' + sum)
  }

  $('form').submit(function () {
    let keySetDND = Array.from(document.getElementsByName('00Nm0000002E0do'));
    keySetDND.forEach(function (e) {
      e.checked ? e.value = "Yes" : e.value = "No";
      e.setAttribute('type', 'hidden');
    })
  })

  var isNumericInput = function isNumericInput(event) {
    var key = event.keyCode;
    return key >= 48 && key <= 57 || key >= 96 && key <= 105;
  };
  
  var isModifierKey = function isModifierKey(event) {
    var key = event.keyCode;
    return event.shiftKey === true || key === 35 || key === 36 || key === 8 || key === 9 || key === 13 || key === 46 || key > 36 && key < 41 || (event.ctrlKey === true || event.metaKey === true) && (key === 65 || key === 67 || key === 86 || key === 88 || key === 90);
  };
  
  var enforceFormat = function enforceFormat(event) {
    if (!isNumericInput(event) && !isModifierKey(event)) {
      event.preventDefault();
    }
  };
  
  var formatToPhone = function formatToPhone(event) {
    if (isModifierKey(event)) {
      return;
    }
  
    var target = event.target;
    var input = target.value.replace(/\D/g, '').substring(0, 10);
    var zip = input.substring(0, 3);
    var middle = input.substring(3, 6);
    var last = input.substring(6, 10);
  
    if (input.length > 5) {
      target.value = "(".concat(zip, ") ").concat(middle, " - ").concat(last);
    } else if (input.length > 2) {
      target.value = "(".concat(zip, ") ").concat(middle);
    } else if (input.length > 0) {
      target.value = "(".concat(zip);
    }
  };
  $('input[type="tel"]').on('keydown',enforceFormat);
  $('input[type="tel"]').on('keyup',formatToPhone);
})