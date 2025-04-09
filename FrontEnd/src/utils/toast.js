import Swal from "sweetalert2";

export function swalPen(title, text, type, showCancelButton, confirmButtonText, cancelButtonText, okCallBack, cancelCallback){
    Swal.fire({
        title: title,
        text: text,
        icon: type,
        confirmButtonColor: '#007BFF',   // 
        showCancelButton: showCancelButton,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
    }).then(function (select) {

        if (select.value === true)
            if (typeof okCallBack === 'function')
                okCallBack();

        if (select.dismiss === 'cancel')
            cancelCallback();
    });
}
export function swalOk(text, okCallBack) {
    swalPen('İşlem Başarılı', text, 'success', false, 'Tamam', '', okCallBack, ()=>{});
};
export function swalSuccess(title) {
    Swal.fire({
        title: title,
        icon: "success",
        showConfirmButton:false,
        showCancelButton: false,
    })
};
export function swalError(text,callBack){
    swalPen('Hata!', text, 'error', false, 'Tamam', '', function () {
        if (typeof callBack === 'function')
            callBack();
    }, function () { });
}
export function swalQuestion(callback, text) {

    var tip = 'warning';
    if (!text) {
        tip = 'question';
        text = "Bu kayıt silinecek , silmek istediğinize emin misiniz?";
    }
    swalPen('Emin misiniz ?', text, tip, true, 'Devam et', 'Vazgeç', callback, ()=>{});
}
export function swalQuestionLogout(callback, text) {

    var tip = 'warning';
    if (!text) {
        tip = 'question';
        text = "Çıkış yapmak istediğinize emin misiniz?";
    }
    swalPen('Emin misiniz ?', text, tip, true, 'Evet', 'Vazgeç', callback, ()=>{});
}
export async function swalKeepQuestion(okCallback, cancelCallback) {
     var  tip = 'success';
      var text = "Ekleme işlemine devam etmek istiyor musunuz ?";
    
    swalPen('Ekleme İşlemi Başarılı', text, tip, true, 'Devam et', 'Kapat', okCallback, cancelCallback);
}
export async function swalKeepQuestionTicket(okCallback, cancelCallback) {
    var  tip = 'success';
     var text = "Ekleme işlemine devam etmek istiyor musunuz ?";
   
   swalPen('Ticket Eklendi !', text, tip, true, 'Devam et', 'Detaya Git', okCallback, cancelCallback);
}
export function showLoad(_title) {

    if (_title === undefined)
        _title = 'Lütfen bekleyiniz';
    Swal.fire({
        title: _title,
        allowOutsideClick: false,
        onOpen: () => {
            Swal.showLoading();
        }
    });
};
export function swalClose(){
    Swal.close();
}