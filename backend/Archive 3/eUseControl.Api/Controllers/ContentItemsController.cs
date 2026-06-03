using eUseControl.BussinessLogic.Functions.ContentItems;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentItemsController : ControllerBase
{
    private readonly IContentItemFlow _contentItemFlow;

    public ContentItemsController(IContentItemFlow contentItemFlow)
    {
        _contentItemFlow = contentItemFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? type = null)
    {
        return Ok(await _contentItemFlow.GetAllAsync(type));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var item = await _contentItemFlow.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContentItemDto dto)
    {
        return Ok(await _contentItemFlow.CreateAsync(dto));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateContentItemDto dto)
    {
        var item = await _contentItemFlow.UpdateAsync(id, dto);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        return await _contentItemFlow.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
