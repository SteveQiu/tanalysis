module.exports = class DataProcessor {
    constructor(data) {
      if(!Array.isArray(data)) this.data = [];
      else this.data = data.filter(d=>d);
      this.data.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      });
    }
    getROTA (revenues, cost, totalassets) {
      // RATE
      // RETURN ON TOTAL ASSETS (or ROY return on investment)
      // ROTA = net income/ average total asset = sale/ (debt+equity)
      if (revenues&& cost&&totalassets)
        return this.getNetincome(revenues, cost)/parseFloat(totalassets);
    }
    getROS (totalrevenue, costofgoodssold) {
      // PROFITABILITY rate
      // RETURN ON sale
      // profit margin = net income/net sale
      // ros = net income/ sale or revenue
      // higher -> better and more competition
      if (costofgoodssold&&totalrevenue) {
        return this.getNetincome(totalrevenue, costofgoodssold)/parseFloat(totalrevenue);
      }
      return null;
    }
    getFacilityEfficiency (longterminvestments, totalrevenue) {
      // RATE
      // How much money used on equipment/long term investments to generate revenue
      // equipment/ totalcostofrevenue
      if (longterminvestments&&totalrevenue)
        return parseFloat(longterminvestments)/parseFloat(totalrevenue);
    }
    getNetincome(revenues, cost){
      if(revenues && cost) 
        return parseFloat(revenues)- parseFloat(cost);
    }
    getDSO (accountsreceivable,totalrevenue) {
      // day sale outstanding
      // how long before receivable collected
      // Receivable / sale * 365
      if (accountsreceivable&&totalrevenue)
        return parseFloat(accountsreceivable)/parseFloat(totalrevenue)*365;
    }
    getAccountReceivablePerDay (accountsreceivable,totalrevenue)  {
      // receivable / getDSO()
      if (this.getDSO(accountsreceivable,totalrevenue) )
        return parseFloat(accountsreceivable)/this.getDSO(accountsreceivable,totalrevenue) ;
    }
    getInventoryClearanceCycle (netinventory, totalcostofrevenue) {
      // Inventory/totalcostofrevenue *365
      if (netinventory&&totalcostofrevenue)
        return parseFloat(netinventory)/parseFloat(totalcostofrevenue)*365;
    }
    getInventorySoldPerDay (netinventory, totalcostofrevenue) {
      // Inventory / getInventoryClearanceCycle()
      if (this.getInventoryClearanceCycle (netinventory, totalcostofrevenue))
        return parseFloat(netinventory)/this.getInventoryClearanceCycle (netinventory, totalcostofrevenue);
    }
    getEquity(assets, liabilities){
      if(assets,liabilities)
        return parseFloat(assets)- parseFloat(liabilities);
    }
    getCashCycle(totalassets,totalrevenue) {
      // Payback cycle
      // invest capital or so called asset/ totalcostofrevenue * 365
      if (totalassets&&totalrevenue) 
        return parseFloat(totalassets)/parseFloat(totalrevenue)*365;
    }
    getDebtToEquityRatio(totalassets, totalliabilities){
      if (totalassets&&totalliabilities) 
        return parseFloat(totalliabilities)/(parseFloat(totalassets)-parseFloat(totalliabilities));
    }
    getDebtToAssetRatio(totalassets, totalliabilities){
      if (totalassets&&totalliabilities) 
        return parseFloat(totalliabilities)/parseFloat(totalassets);
    }
    getRevenueToCostRatio(totalrevenue, totalcostofrevenue){
      if (totalrevenue && totalcostofrevenue)
        return parseFloat(totalrevenue)/parseFloat(totalcostofrevenue);
    }
    populateAnalysis(row) {
      var newRow = {};
      newRow.date = row.date;
      newRow['Receivable per Day'] = this.getAccountReceivablePerDay(row.accountsreceivablenetcurrent, row.revenues);
      newRow['Inventory Sold per Day'] = this.getInventorySoldPerDay(row.inventorynet, row.costofgoodssold);
      return newRow;
    }
    get analysis() {
        var newData = [];
        // populate data
        for (var i = 0; i < this.data.length; i++) {
          newData[i] = this.populateAnalysis(this.data[i]);
        }
       return newData;
    }
    populateRate(row) {
      var newRow = {};
      newRow.date = row.date;
      newRow['Return On Investment'] = this.getROTA(row.revenues, row.costofgoodssold, row.assets);
      newRow['Return On Sale'] = this.getROS(row.revenues, row.costofgoodssold);
      newRow['Facility Efficiency'] = this.getFacilityEfficiency(row.propertyplantandequipmentnet, row.revenues);
      newRow['Debt To Equity Ratio'] = this.getDebtToEquityRatio(row.assets, row.liabilities);
      newRow['Debt To Asset Ratio'] = this.getDebtToAssetRatio(row.assets, row.liabilities);
      newRow['Revenue To Cost Ratio'] = this.getRevenueToCostRatio(row.revenues, row.costofgoodssold);
      return newRow;
    }
    get rate() {
      var newData = [];
      // populate data
      for (var i = 0; i < this.data.length; i++) {
        newData[i] = this.populateRate(this.data[i]);
      }
     return newData;
    }
    populateCycle(row) {
      var newRow = {};
      newRow.date = row.date;
      newRow['Day Sale Outstanding'] = this.getDSO(row.accountsreceivablenetcurrent, row.revenues);
      newRow['Inventory Clearance Cycle'] = this.getInventoryClearanceCycle(row.inventorynet, row.costofgoodssold);
      newRow['Cash Cycle'] = this.getCashCycle(row.assets, row.revenues);
      return newRow;
    }
    get cycle() {
      var newData = [];
      // populate data
      for (var i = 0; i < this.data.length; i++) {
        newData[i] = this.populateCycle(this.data[i]);
      }
     return newData;
    }
    populateStatusData(row){
      var newRow = {};
      newRow.date = row.date;
      newRow.totalrevenue=row.revenues;
      newRow.totalcostofrevenue=row.costofgoodssold;
      newRow.netincome=this.getNetincome(row.revenues,row.costofgoodssold);
      newRow.totaloperatingexpenses=row.operatingexpenses;
      newRow.totalassets=row.assets;
      newRow.totalliabilities=row.liabilities;
      newRow.totalequity=this.getEquity(row.assets,row.liabilities);
      return newRow;
    }
    get statusData(){
      var newData = [];
      // populate data
      for (var i = 0; i < this.data.length; i++) {
        newData[i] = this.populateStatusData(this.data[i]);
      }
     return newData;
    }
    get rawData (){
      return JSON.parse(JSON.stringify(this.data));
    }
}
