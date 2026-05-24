document.addEventListener('DOMContentLoaded', () => {
    const CORRECT_PIN = "1234";
    let currentBalance = 10000.00;
    let currentPinEntry = "";

    const views = document.querySelectorAll('.view');
    const notification = document.getElementById('notification');
    const notifMessage = document.getElementById('notif-message');

    const pinInput = document.getElementById('pin-input');
    const keys = document.querySelectorAll('.keypad .key:not(.action-btn)');
    const btnCancelLogin = document.getElementById('btn-cancel-login');
    const btnEnterPin = document.getElementById('btn-enter-pin');

    const balanceTexts = document.querySelectorAll('.current-balance-text');
    const displayBalance = document.getElementById('display-balance');

    function formatCurrency(amount) {
        return `L. ${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    function updateBalanceDisplays() {
        balanceTexts.forEach(el => el.textContent = formatCurrency(currentBalance));
        if (displayBalance) displayBalance.textContent = formatCurrency(currentBalance);
    }

    function showNotification(msg, isError = false) {
        notifMessage.textContent = msg;
        notification.className = `notification ${isError ? 'error' : ''}`;

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    function switchView(viewId) {
        views.forEach(v => {
            v.classList.remove('active');
            v.classList.add('hidden');
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
            targetView.classList.add('active');

            updateBalanceDisplays();

            const inputs = targetView.querySelectorAll('input:not(#pin-input)');
            inputs.forEach(i => i.value = '');
            const selects = targetView.querySelectorAll('select');
            selects.forEach(s => s.selectedIndex = 0);
        }
    }

    document.getElementById('btn-ingresar').addEventListener('click', () => {
        switchView('view-login');
        currentPinEntry = "";
        pinInput.value = "";
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        showNotification("Sesión cerrada exitosamente.");
        switchView('view-welcome');
        currentPinEntry = "";
        pinInput.value = "";
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView('view-menu'));
    });

    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            switchView(target);
        });
    });

    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (currentPinEntry.length < 4) {
                currentPinEntry += key.textContent;
                pinInput.value = '*'.repeat(currentPinEntry.length);
            }
        });
    });

    btnCancelLogin.addEventListener('click', () => {
        currentPinEntry = "";
        pinInput.value = "";
        switchView('view-welcome');
    });

    btnEnterPin.addEventListener('click', () => {
        if (currentPinEntry === CORRECT_PIN) {
            showNotification("¡Bienvenido!");
            switchView('view-menu');
        } else {
            showNotification("PIN Incorrecto. Intente de nuevo.", true);
            currentPinEntry = "";
            pinInput.value = "";
        }
    });

    const withdrawAmountInput = document.getElementById('withdraw-amount');
    document.getElementById('btn-confirm-withdraw').addEventListener('click', () => {
        const amount = parseFloat(withdrawAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showNotification("Ingrese un monto válido.", true);
            return;
        }
        if (amount > currentBalance) {
            showNotification("Saldo insuficiente.", true);
            return;
        }

        currentBalance -= amount;
        showNotification(`Retiro exitoso de ${formatCurrency(amount)}`);
        switchView('view-menu');
    });

    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            withdrawAmountInput.value = e.target.getAttribute('data-val');
        });
    });

    document.getElementById('btn-confirm-deposit').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        if (isNaN(amount) || amount <= 0) {
            showNotification("Ingrese un monto válido.", true);
            return;
        }

        currentBalance += amount;
        showNotification(`Depósito exitoso de ${formatCurrency(amount)}`);
        switchView('view-menu');
    });

    document.getElementById('btn-confirm-transfer').addEventListener('click', () => {
        const account = document.getElementById('transfer-account').value;
        const amount = parseFloat(document.getElementById('transfer-amount').value);

        if (account.trim().length < 5) {
            showNotification("Ingrese una cuenta válida.", true);
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            showNotification("Ingrese un monto válido.", true);
            return;
        }
        if (amount > currentBalance) {
            showNotification("Saldo insuficiente.", true);
            return;
        }

        currentBalance -= amount;
        showNotification(`Transferencia de ${formatCurrency(amount)} exitosa.`);
        switchView('view-menu');
    });

    document.getElementById('btn-confirm-payment').addEventListener('click', () => {
        const service = document.getElementById('payment-service').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);

        if (!service) {
            showNotification("Seleccione un servicio.", true);
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            showNotification("Ingrese un monto válido.", true);
            return;
        }
        if (amount > currentBalance) {
            showNotification("Saldo insuficiente.", true);
            return;
        }

        currentBalance -= amount;
        showNotification(`Pago a ${service} por ${formatCurrency(amount)} realizado.`);
        switchView('view-menu');
    });
});
