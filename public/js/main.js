let socket = io();
let state = {};

// outbound
$(window).on("load", () => {
    $('input[type=checkbox]').each(function() {
        $(this).change(sendState);
    });
});

// inbound
socket.on("state", data => {
    state = data;

    $('#light')[0].checked = state.light.enabled;
    $('#party')[0].checked = state.party.enabled;
    $('#connection')[0].checked = state.connection.enabled;
});

function sendState() {
    state = {
        light: {
            enabled: $('#light')[0].checked
        },
        party: {
            enabled: $('#party')[0].checked
        },
        connection: {
            enabled: $('#connection')[0].checked
        }
    };

    socket.emit('state', state);
}
