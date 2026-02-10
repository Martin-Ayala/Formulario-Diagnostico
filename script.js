// 1. Configuración de Supabase
const SUPABASE_URL = 'https://vgvwvsborcotnrlfdxdj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndnd2c2JvcmNvdG5ybGZkeGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2Njk4NDUsImV4cCI6MjA4NjI0NTg0NX0.YMLRhVfjdkRONmRZlS-CfkEnPoIVXnMZEhaT9cfsGMA';

// Usamos un nombre diferente para evitar el error de la consola
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    let isValid = true;

    // Función robusta para mostrar/ocultar errores
    const toggleError = (input, show) => {
        if (!input) return; // Seguridad si el input no existe
        const group = input.closest('.form-group');
        if (group) {
            show ? group.classList.add('error') : group.classList.remove('error');
        }
    };

    // A. Validar Campos de Texto
    const textFields = ['firstName', 'lastName', 'message'];
    textFields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const isBlank = input.value.trim() === '';
            toggleError(input, isBlank);
            if (isBlank) isValid = false;
        }
    });

    // B. Validar Email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isInvalidEmail = !emailPattern.test(emailInput.value.trim());
        toggleError(emailInput, isInvalidEmail);
        if (isInvalidEmail) isValid = false;
    }

    // C. Validar Radio Buttons (Tipo de consulta)
    // Notita: en el HTML los radios tienen name="queryType"
    const queryType = document.querySelector('input[name="queryType"]:checked');
    const radioGroup = document.querySelector('.radio-group');
    if (!queryType) {
        if (radioGroup) radioGroup.closest('.form-group').classList.add('error');
        isValid = false;
    } else {
        if (radioGroup) radioGroup.closest('.form-group').classList.remove('error');
    }

    // D. Validar Checkbox
    const consent = document.getElementById('consent');
    if (consent) {
        const consentGroup = consent.closest('.form-group');
        if (!consent.checked) {
            if (consentGroup) consentGroup.classList.add('error');
            isValid = false;
        } else {
            if (consentGroup) consentGroup.classList.remove('error');
        }
    }

    //ENVÍO
    if (isValid) {
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const formData = {
                first_name: document.getElementById('firstName').value,
                last_name: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                query_type: queryType.value,
                message: document.getElementById('message').value,
                consent: true
            };

            const { error } = await supabaseClient
                .from('form_submissions')
                .insert([formData]);

            if (error) throw error;

            showSuccessMessage();
            this.reset(); 

        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar. Revisa la tabla en Supabase.');
        } finally {
            submitBtn.textContent = 'Enviar';
            submitBtn.disabled = false;
        }
    }
});

function showSuccessMessage() {
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 4000);
    }
}