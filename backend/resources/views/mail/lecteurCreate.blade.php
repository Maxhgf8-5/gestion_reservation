<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .card { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto; }
        .title { color: #333; font-size: 22px; font-weight: bold; }
        .info { background: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .label { color: #888; font-size: 13px; }
        .value { color: #222; font-size: 16px; font-weight: bold; }
        .footer { color: #aaa; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <p class="title">Bienvenue, {{ $name }} </p>
        <p>Un compte lecteur a été créé pour vous. Voici vos identifiants :</p>

        <div class="info">
            <p class="label">Email</p>
            <p class="value">{{ $email }}</p>

            <p class="label">Mot de passe</p>
            <p class="value">{{ $password }}</p>
        </div>

        <p> Pensez à changer votre mot de passe après votre première connexion.</p>

        <p class="footer">Cet email a été envoyé automatiquement, ne pas répondre.</p>
    </div>
</body>
</html>