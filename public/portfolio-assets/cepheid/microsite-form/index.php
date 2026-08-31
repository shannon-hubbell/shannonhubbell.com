<?php
header("Content-Type: application/json", true);

$page = $_POST["page"];
$first_name = $_POST["first_name"];
$last_name = $_POST["last_name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$company = $_POST["company"];
$job_title = $_POST["job_title"];
$Main_Country = "Country Placeholder";
$comments = "Comments Placeholder";
$zip = "Zip Placeholder";

$data = array(
    'first_name' => $first_name,
    'last_name' => $last_name,
    'email' => $email,
    'phone' => $phone,
    'company' => $company,
    'job_title' => $job_title,
    'Main_Country' => $Main_Country,
    'comments' => $comments,
    'zip' => $zip

);

if ($page == "lead") {
    $url = "http://info.cepheid.com/l/287772/2023-11-07/37xkp4";
} elseif ($page == "guide") {
    $url = "https://info.cepheid.com/l/287772/2023-11-08/37xwrm";
}

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded",
        'method'  => 'POST',
        'content' => http_build_query($data)
      )
);

$context  = stream_context_create($options);
$resp = file_get_contents($url, false, $context);
echo $resp;
echo http_build_query($data);