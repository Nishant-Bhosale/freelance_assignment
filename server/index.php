<?php
require 'vendor/autoload.php';

use Google\Client;
use Google\Service\Sheets;

function setupClient(){
        $client = new Google\Client();
        $client->setAuthConfig('./credentials.json');
        $client->addScope(Google_Service_Sheets::SPREADSHEETS_READONLY);
        return $client;
}

function getValuesFromCells($spreadsheetId, $range){
    $client = setupClient();
    $service = new Google\Service\Sheets($client);
    $response = $service->spreadsheets_values->get($spreadsheetId, $range);
    
    return $response;
}

function extractBackgroundColor($spreadsheetId, $range, $response){
        $client = setupClient();
        $service = new Google\Service\Sheets($client);
        $fields = $service->spreadsheets->get($spreadsheetId,[
            'ranges' => $range,
            'fields' => 'sheets.data.rowData.values.userEnteredFormat.backgroundColor',
        ]);

                
        $formattingData = $fields->getSheets()[0]['data'][0]['rowData'];

        $result = [];

        // Iterate through the values and formatting data
        foreach ($response as $index => $row) {
            $cellValue = $row[0]; // Value in the cell
            $backgroundColor = isset($formattingData[$index]['values'][0]['userEnteredFormat']['backgroundColor'])
                ? $formattingData[$index]['values'][0]['userEnteredFormat']['backgroundColor']
                : null;

            // Store the cell value and background color in the result array
            $result[] = [
                'value' => $cellValue,
                'backgroundColor' => $backgroundColor,
            ];
        }

        return $result;
}

function getValuesFromColumns($spreadsheetId, $range){
    $client = setupClient();
    $service = new Google\Service\Sheets($client);
    $response = $service->spreadsheets_values->get($spreadsheetId, $range)->getValues();

    $result = [];   

    foreach($response as $row){
        if(!empty($row)){
            $result[] = $row;
        }else{
            break;
        }
    }

    return $result;
}

function processInputValues($inputValues){
      $userInputFields = [];
        $sellerInputFields = [];

        foreach ($inputValues as $row) {
            if (!empty($row[0])) {
                $sellerInputFields[] = $row[0];
            }
            
            foreach ($row as $index => $value) {
                if (!empty($value) && $index !== 0) {
                    $userInputFields[] = $value;
                }
            }
        }

        $inputFields = ["sellerInputs" => $sellerInputFields, "userInputs" => $userInputFields];
        return $inputFields;
}

function getValues($spreadsheetId, $range){   
        $inputFieldRange = "{$range}!E4:C11";
        $productNamesRange = "{$range}!C17:C";
        $productPricesRange = "{$range}!D17:D";
        $productWeeklyPaymentsRange = "{$range}!E17:E";

        $inputs = getValuesFromCells($spreadsheetId, $inputFieldRange);
        $productNames = getValuesFromColumns($spreadsheetId, $productNamesRange);

        $productNamesAndBgColors = extractBackgroundColor($spreadsheetId, $productNamesRange, $productNames);    

        $productPrices = getValuesFromColumns($spreadsheetId, $productPricesRange);
        $productWeeklyPayments = getValuesFromColumns($spreadsheetId, $productWeeklyPaymentsRange);


        $inputValues = $inputs->getValues();
        $inputFields = processInputValues($inputValues);

        $finalResponse = json_encode([
            "inputs" => $inputFields,
            "products" => $productNamesAndBgColors,
            "productPrices" => $productPrices,
            "productWeeklyPayments" => $productWeeklyPayments
        ], true);
        
        echo $finalResponse;
        // try{

        // }
        // catch(Exception $e) {
        //     echo 'Message: ' .$e->getMessage();
        // }
    }

    echo getValues("1rGEFBZAAj06Dq_DFYCGRCPxaSogdC8UZNsROj_6AF0g", "Custom NEW");
?>