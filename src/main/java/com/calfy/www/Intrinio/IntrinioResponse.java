package com.calfy.www.Intrinio;

import java.util.Iterator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.intrinio.models.ApiResponseReportedFinancials;
import com.intrinio.models.ReportedFinancial;

//tag::code[]
@JsonIgnoreProperties(ignoreUnknown = true)
public class IntrinioResponse {
	
	private IntrionioDataList data;
	
	public IntrinioResponse(){}
	
	public IntrinioResponse(ApiResponseReportedFinancials result){
		this.data = new IntrionioDataList();
		Iterator<ReportedFinancial> iterator = result.getReportedFinancials().iterator();
		while(iterator.hasNext()) {
			this.data.add(new IntrinioData(iterator.next()));
		}
	}

	
	public void setData(IntrionioDataList val){
		this.data= val;
	}
	public IntrionioDataList getData(){
		return this.data;
	}
	
}
