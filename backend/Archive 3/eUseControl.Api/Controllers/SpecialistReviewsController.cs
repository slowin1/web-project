using eUseControl.BussinessLogic.Functions.SpecialistReviews;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpecialistReviewsController : ControllerBase
{
    private readonly ISpecialistReviewFlow _specialistReviewFlow;

    public SpecialistReviewsController(ISpecialistReviewFlow specialistReviewFlow)
    {
        _specialistReviewFlow = specialistReviewFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _specialistReviewFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var review = await _specialistReviewFlow.GetByIdAsync(id);
        return review is null ? NotFound() : Ok(review);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSpecialistReviewDto dto) => Ok(await _specialistReviewFlow.CreateAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSpecialistReviewDto dto)
    {
        var review = await _specialistReviewFlow.UpdateAsync(id, dto);
        return review is null ? NotFound() : Ok(review);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _specialistReviewFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
