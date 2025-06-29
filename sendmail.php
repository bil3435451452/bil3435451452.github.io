<?php
header('Content-Type: application/json');

// Проверка, что запрос пришел методом POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Метод запроса должен быть POST']);
    exit;
}

// Получение данных из формы
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Валидация данных
if (empty($name) || empty($phone) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Заполните обязательные поля']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Укажите корректный email']);
    exit;
}

// Настройки письма
$to = 'bloody.joker1212@gmail.com';
$subject = 'Новая заявка с сайта MAHADEV Studio';
$headers = "From: MAHADEV Studio <noreply@mahadev.ru>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Формирование тела письма
$email_body = "Имя: $name\n";
$email_body .= "Телефон: $phone\n";
$email_body .= "Email: $email\n";
$email_body .= "Сообщение:\n$message\n";
$email_body .= "\n\nДата отправки: " . date('d.m.Y H:i:s');

// Отправка письма
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Ваша заявка успешно отправлена!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки. Пожалуйста, попробуйте позже.']);
}