using EUseControl.DataAccess.Context;
using eUseControl.Domain.DTOs;
using eUseControl.Domain.Entities.Specialist;
using Microsoft.EntityFrameworkCore;

namespace eUseControl.BussinessLogic.Core.SpecialistReviews;

public class SpecialistReviewActions
{
    private readonly UserContext _context;

    protected SpecialistReviewActions(UserContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SpecialistReviewResponseDto>> GetAllAsync()
    {
        var reviews = await _context.Reviews.AsNoTracking().ToListAsync();
        return reviews.Select(MapReview);
    }

    public async Task<SpecialistReviewResponseDto?> GetByIdAsync(string id)
    {
        var review = await _context.Reviews.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return review is null ? null : MapReview(review);
    }

    public async Task<SpecialistReviewResponseDto> CreateAsync(CreateSpecialistReviewDto dto)
    {
        var review = new SpecialistReview
        {
            Id = Guid.NewGuid().ToString(),
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
            CreatedAt = DateTime.UtcNow,
            ClientId = dto.ClientId,
            BookingId = dto.BookingId
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return MapReview(review);
    }

    public async Task<SpecialistReviewResponseDto?> UpdateAsync(string id, UpdateSpecialistReviewDto dto)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review is null)
        {
            return null;
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment.Trim();
        review.ClientId = dto.ClientId;
        review.BookingId = dto.BookingId;

        await _context.SaveChangesAsync();
        return MapReview(review);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review is null)
        {
            return false;
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return true;
    }

    private static SpecialistReviewResponseDto MapReview(SpecialistReview review)
    {
        return new SpecialistReviewResponseDto
        {
            Id = review.Id,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
            ClientId = review.ClientId,
            BookingId = review.BookingId
        };
    }
}
