package com.calfy.www.database;

import org.springframework.data.annotation.Id;

import com.calfy.www.Intrinio.IntrinioResponse;

public class DatedQuote {

	@Id
    public String id;
	public String name;
    public String year;
    public IntrinioResponse response;
    public int test;
    
    public DatedQuote() {}

    public DatedQuote(String name, String year, IntrinioResponse response) {
        this.name = name;
        this.year = year;
        this.response = response;
    }
    
    @Override
    public String toString() {
        return String.format("DatedQuote[id=%s, name='%s', year='%s']",id, name, year);
    }
}
