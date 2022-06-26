package com.calfy.www.Intrinio;

import org.springframework.stereotype.Service;
import com.intrinio.api.*;
import com.intrinio.models.*;
import com.intrinio.invoker.*;
import com.intrinio.invoker.auth.*;
import org.threeten.bp.*;
import java.math.BigDecimal;

@Service
public class IntrinioService {
	
	ApiClient defaultClient = Configuration.getDefaultApiClient();
    ApiKeyAuth auth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");

    SecurityApi securityApi = new SecurityApi();

    String identifier = "AAPL"; // String | A Security identifier (Ticker, FIGI, ISIN, CUSIP, Intrinio ID)
    LocalDate startDate = null; // LocalDate | Return prices on or after the date
    LocalDate endDate = null; // LocalDate | Return prices on or before the date
    String frequency = "daily"; // String | Return stock prices in the given frequency
    BigDecimal pageSize = null; // BigDecimal | The number of results to return
    String nextPage = null; // String | Gets the next page of data from a previous API call

	public IntrinioService() {
//		auth.setApiKey("OmE0MDRiNjc5NDJhMDhkZWY1YmE1ZWM5Y2IwNGUwMWRi");//sandbox
		auth.setApiKey("OjVmOWI5Njc4MjQyYTBkMThiZGE5NjcxMjY5ZGY0Mjg5");//live
	}

    public IntrinioResponse getFinancialStatement(String name, String year) {
    	if(name==null||name=="") return null;
    	IntrinioResponse res = null;
    	IntrinioResponse tmp = null;
    	IntrionioDataList data1 = null;
    	IntrionioDataList data2 = null;
    	res = getIncomeStatement(name,year);
    	tmp = getBalanceSheet(name,year);
    	if(res!=null&&tmp!=null){
    		data1 = res.getData();
    		data2 = tmp.getData();
    		data1.addAll(data2);
    		res.setData(data1);
    		return res;
    	}
    	else if(tmp!=null){
    	  return tmp;
    	}
        return res;
    }
    
	public IntrinioResponse getFinancialStatement(String name, String year, String quarter) {
		if(name==null||name==""|| quarter==null) return null;
    	IntrinioResponse res = null;
    	IntrinioResponse tmp = null;
    	IntrionioDataList data1 = null;
    	IntrionioDataList data2 = null;
    	res = getIncomeStatement(name,year,quarter);
    	tmp = getBalanceSheet(name,year,quarter);
    	if(res!=null&&tmp!=null){
    		data1 = res.getData();
    		data2 = tmp.getData();
    		data1.addAll(data2);
    		res.setData(data1);
    		return res;
    	}
    	else if(tmp!=null){
    	  return tmp;
    	}
        return res;
	}

	// String | The Intrinio ID or lookup code (ticker-statement-year-period) for the Fundamental, combined with the following:
	// A Company identifier (Ticker, CIK, LEI, Intrinio ID)
    // The statement code [enum: income_statement, balance_sheet_statement, cash_flow_statement, calculations]
	// The fiscal year
	// The fiscal period [enum: Q1TTM, Q2TTM, Q3TTM, FY, Q1, Q2, Q3, Q4, Q2YTD, Q3YTD]
    // https://github.com/intrinio/java-sdk/blob/master/docs/FundamentalsApi.md#getFundamentalReportedFinancials
    public IntrinioResponse getIncomeStatement(String name, String year) {
    	if(name==null||name=="") return null;
    	IntrinioResponse res = null;
    	FundamentalsApi fundamentalsApi = new FundamentalsApi();
        String id = name+"-income_statement-"+year+"-FY";
        try {
            ApiResponseReportedFinancials result = fundamentalsApi.getFundamentalReportedFinancials(id);
            res = new IntrinioResponse(result);
        } catch (ApiException e) {
        	System.err.println("Unable to get "+id);
        }
        return res;
    }

	public IntrinioResponse getIncomeStatement(String name, String year, String quarter) {
    	if(name==null||name==""|| quarter==null) return null;
    	IntrinioResponse res = null;
    	FundamentalsApi fundamentalsApi = new FundamentalsApi();
        String id = name+"-income_statement-"+year+"-Q"+quarter;
        try {
            ApiResponseReportedFinancials result = fundamentalsApi.getFundamentalReportedFinancials(id);
            res = new IntrinioResponse(result);
        } catch (ApiException e) {
        	System.err.println("Unable to get "+id);
        }
        return res;
    }

    public IntrinioResponse getBalanceSheet(String name, String year) {
    	if(name==null||name=="") return null;
    	IntrinioResponse res = null;
    	FundamentalsApi fundamentalsApi = new FundamentalsApi();
        String id = name+"-balance_sheet_statement-"+year+"-FY";
        try {
        	ApiResponseReportedFinancials result = fundamentalsApi.getFundamentalReportedFinancials(id);
            res = new IntrinioResponse(result);
        } catch (ApiException e) {
        	System.err.println("Unable to get "+id);
        }
        return res;
    }

	public IntrinioResponse getBalanceSheet(String name, String year, String quarter) {
    	if(name==null||name==""|| quarter==null) return null;
    	IntrinioResponse res = null;
    	FundamentalsApi fundamentalsApi = new FundamentalsApi();
        String id = name+"-balance_sheet_statement-"+year+"-Q"+quarter;
        try {
            ApiResponseReportedFinancials result = fundamentalsApi.getFundamentalReportedFinancials(id);
            res = new IntrinioResponse(result);
        } catch (ApiException e) {
        	System.err.println("Unable to get "+id);
        }
        return res;
    }
	
	public String getCompaniesCSV() {
		String res = "";
		CompanyApi companyApi = new CompanyApi();
        String nextPage = null;
        StringBuilder sb = new StringBuilder();
        sb.append("ticker,name\n");
        try {
            ApiResponseCompanies result = companyApi.getAllCompanies(null, nextPage, null, null, null, null, pageSize, null);
            for(CompanySummary item: result.getCompanies()) {
            	sb.append(item.getTicker()+","+item.getName()+"\n");
            }
            res = sb.toString();
        } catch (ApiException e) {
        	System.err.println("Unable to get company list");
        }
        return res;
    }

}
