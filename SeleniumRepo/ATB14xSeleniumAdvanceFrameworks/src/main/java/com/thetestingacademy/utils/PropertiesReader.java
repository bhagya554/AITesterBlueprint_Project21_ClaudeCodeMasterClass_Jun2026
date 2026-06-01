package com.thetestingacademy.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertiesReader {

    // Read the data.properties and readKey - url -> data.properties file
    // and give you the value of the that url -> https://app.vwo.com
    public static String readKey(String key) {
        Properties p;

        try {
            String user_dir = System.getProperty("user.dir");
            // /Users/promode/Documents/TTA/ATB14xSeleniumAdvanceFramework/src/main/resources/data.properties
            String file_path = user_dir + "/src/main/resources/data.properties";
            FileInputStream fileInputStream = new FileInputStream(file_path);
            p = new Properties();
            p.load(fileInputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return p.getProperty(key);
    }


}
