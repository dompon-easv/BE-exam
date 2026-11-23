using LinqToDB.Mapping;

namespace infra.Entities;

[LinqToDB.Mapping.Table("vacation_details")]
public class VacationDetails
{
    [PrimaryKey] 
    [Column("id")] 
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Column("agreement_id"), NotNull]
    public Guid AgreementId { get; set; } //Holiday act vs KL agreement, foreign key
    
    [Column("unit")]
    public string? Unit { get; set; } //collect days of hours
    
    [Column("rate")]
    public decimal? Rate { get; set; } //how many units collected per month
    
    [Column("earning_start_day")]
    public int? EarningStartDay { get; set; } //when does the fiscal period start,day of the month 01-31
    
    [Column("earning_start_month")]
    public int? EarningStartMonth { get; set; } //when does the fiscal period start,month 01-12
    
    [Column("earning_end_day")]
    public int? EarningEndDay { get; set; } // when fiscal period ends, day of the month 01-31
    
    [Column("earning_end_month")]
    public int? EarningEndMonth { get; set; } // when fiscal period ends, month 01-12
    
    [Column("earning_end_offset")]
    public int? EarningEndOffset { get; set; } //1 if end is in the following year comparing to start
    
    [Column("usage_start_day")]
    public int? UsageStartDay { get; set; } //when can they start spending, day of the month 01-31
    
    [Column("usage_start_month")]
    public int? UsageStartMonth { get; set; }
    
    [Column("usage_end_day")]
    public int? UsageEndDay { get; set; } //deadline for spending, day
    
    [Column("usage_end_month")]
    public int? UsageEndMonth { get; set; }
    
    [Column("usage_end_offset")]
    public int? UsageEndOffset { get; set; } //1 if end is in the following year
    
    
}