<?php
$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Grab all the inputs and clean them up for security
    $username = htmlspecialchars(trim($_POST["username"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $text = htmlspecialchars(trim($_POST["user_text"]));

    // The slider sends a number (1 for Cat, 2 for Dog)
    $animal_value = $_POST["animal"];
    $animal_choice = ($animal_value == 1) ? "Cats" : "Dogs";

    if (empty($username) || empty($email)) {
        $message = "<p style='color: red; font-size: 14px;'>Username and Email are required.</p>";
    } else {
        // 1. Package the new data into an array
        $new_data = [
            "username" => $username,
            "email" => $email,
            "message" => $text,
            "prefers" => $animal_choice
        ];

        // 2. Set the file name
        $file_name = "username.json";
        $existing_data = [];

        // 3. If the JSON file already exists, open it and read the current data
        if (file_exists($file_name)) {
            $json_string = file_get_contents($file_name);
            $existing_data = json_decode($json_string, true);

            // If the file was empty or corrupted, ensure we start with an array
            if (!is_array($existing_data)) {
                $existing_data = [];
            }
        }

        // 4. Add the new submission to our list of data
        $existing_data[] = $new_data;

        // 5. Convert back to JSON and save it (JSON_PRETTY_PRINT makes it readable)
        file_put_contents($file_name, json_encode($existing_data, JSON_PRETTY_PRINT));

        $message = "<p style='color: green; font-size: 14px;'>Success! Data saved to username.json.</p>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile Input</title>
    <link rel="stylesheet" href="username.css">
</head>

<body>

    <div class="input-container">
        <form method="POST" action="username.php">
            <h3>Create Profile</h3>

            <?php echo $message; ?>

            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="e.g., cool_user99" required>

            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required>

            <label for="user_text">Tell us about yourself</label>
            <textarea id="user_text" name="user_text" rows="3" placeholder="I love coding..."></textarea>

            <div class="slider-container">
                <label for="animal">Which do you prefer?</label>
                <div class="slider-labels">
                    <span>🐱 Cats</span>
                    <span>Dogs 🐶</span>
                </div>
                <input type="range" id="animal" name="animal" min="1" max="2" value="1">
            </div>

            <button type="submit">Save Profile</button>
        </form>
    </div>

</body>

</html>