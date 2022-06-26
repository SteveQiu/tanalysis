/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.calfy.www.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.calfy.www.Intrinio.IntrinioResponse;
import com.calfy.www.Intrinio.IntrinioService;
import com.calfy.www.database.DatedQuote;
import com.calfy.www.database.DatedQuoteService;

/**
 * @author Steve Qiu
 */
@Controller
public class HomeController {
	IntrinioService intrinio= new IntrinioService();
	
	@Autowired
	private DatedQuoteService datedQuoteService;
	
	@Value("${intrinio.service.enable}")
	private boolean intrinioEnabled;
	
	private final String COMPANIES_LIST_PATH = "src/main/resources/static/assets/csv/companies.csv";

	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}

	@RequestMapping(value = "/finance", method = RequestMethod.GET, produces = "application/hal+json")
	@ResponseBody
    public ResponseEntity<HashMap<String, Object>> finance(
    		@RequestParam(value="name", defaultValue="AAPL") String name,
    		@RequestParam(value="year", defaultValue="2015") String year, 
    		@RequestParam(value="quarter", defaultValue="") String quarter) 
	{
		HashMap<String, Object> res = new HashMap<String, Object>();
		
		if (year==null||quarter==null) {
			 fetchFinancialData(name, year, quarter);
		}
		
		List<DatedQuote> caches = datedQuoteService.findByName(name);
		
		res.put("response", caches);
		
		return ResponseEntity.status(200).body(res);
    }

	private void fetchFinancialData(String name, String year, String quarter) {
		if (!intrinioEnabled) {
			System.out.println("Intrinio Service disabled");
		}
		IntrinioResponse tmp;
		if (quarter.equals("")) tmp = this.intrinio.getFinancialStatement(name.toUpperCase(), year);
		else tmp = this.intrinio.getFinancialStatement(name.toUpperCase(), year, quarter);
		
		datedQuoteService.save(new DatedQuote(name, year + "Q" + quarter, tmp));
	}

	@RequestMapping(value = "/companies-list.csv", method = RequestMethod.GET, produces = "text/csv")
	@ResponseBody
    public String companiesList(HttpServletResponse response) {
		
		response.setContentType("text/csv; charset=utf-8");
		String res="",line;
		StringBuilder sb = new StringBuilder();
		String ls = System.getProperty("line.separator");
		
		try {
			BufferedReader br = new BufferedReader(new FileReader(COMPANIES_LIST_PATH));
	
			while((line = br.readLine()) != null) {
				sb.append(line);
				sb.append(ls);
	        }
			res = sb.toString();
			br.close();
		} catch (IOException e1) {
			// fetch data
			res = this.intrinio.getCompaniesCSV();
			BufferedWriter writer;
			try {
				writer = new BufferedWriter(new FileWriter(COMPANIES_LIST_PATH));
				writer.write(res);
				writer.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	    }
		
		return res;
    }


}
