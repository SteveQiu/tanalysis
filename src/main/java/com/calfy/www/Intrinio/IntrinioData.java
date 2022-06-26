package com.calfy.www.Intrinio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.intrinio.models.ReportedFinancial;

//tag::code[]
@JsonIgnoreProperties(ignoreUnknown = true)
public class IntrinioData {

	private String tag="";
	
	IntrinioData(){}

	IntrinioData(String tag, String value){
		this.tag = tag;
		this.name = tag;
		this.value = value;
	}
	
	IntrinioData(ReportedFinancial item){
		this.tag = item.getXbrlTag().getTag();
		this.name = item.getXbrlTag().getName();
		this.value = item.getValue().toString();
	}

	public void setTag(String val){
		this.tag= val;
	}
	public String getTag(){
		return this.tag;
	}

	private String name="";
	public void setName(String val){
		this.name= val;
	}
	public String getName(){
		return this.name;
	}

	private String value="";
	public void setValue(String val){
		this.value= val;
	}
	public String getValue(){
		return this.value;
	}
	
	@Override
	public String toString() {
		return this.getName()+":"+this.getValue();
	}

}
