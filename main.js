function sendtext() {
    // memo_text에 적은 value를 가지고 온다
    let memo = $('#memo_text').val()

    $.ajax({
        // insert를 하기 위해서 api post요청으로 data를 보낸다.
        type: "POST",
        url: "/api/memo",
        data: {
            // 보낼 data는 input에 적은 value이기 대문에 $('#memo_text').val()을 보낸다.
            memo_give: memo
        },
        success: function (response) {
            // data가 성공적으로 보내졌으면 초기화면으로 돌아간다.
            window.location.reload()
        }
    })

}


// write_empty()를 누르면 해당 row 내용이 제거될 수 있게 server 요청
function write_empty(plan_memo) {

    // plan_memo는 {{ post['memo'] }} data를 의미한다.
    $.ajax({
        // clear btn을 누르면 delete 기능을 할 것이기 때문에 server에 api post요청을 해서 data를 보낸다.
        type: "POST",
        url: "/api/delete",
        data: {
            // clear btn을 누른 post['memo'] 부분을 삭제할 것이기 때문에 data_give에 담아서 보낸다.
            memo_give: plan_memo
        },
        success: function (response) {
            // data가 성공적으로 보내졌으면 초기화면으로 돌아간다.
            window.location.reload()
        }
    })
}