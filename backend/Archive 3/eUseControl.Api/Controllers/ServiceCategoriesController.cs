using eUseControl.BussinessLogic.Functions.ServiceCategories;
using eUseControl.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace eUseControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceCategoriesController : ControllerBase
{
    private readonly IServiceCategoryFlow _serviceCategoryFlow;

    public ServiceCategoriesController(IServiceCategoryFlow serviceCategoryFlow)
    {
        _serviceCategoryFlow = serviceCategoryFlow;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _serviceCategoryFlow.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var category = await _serviceCategoryFlow.GetByIdAsync(id);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceCategoryDto dto) => Ok(await _serviceCategoryFlow.CreateAsync(dto));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateServiceCategoryDto dto)
    {
        var category = await _serviceCategoryFlow.UpdateAsync(id, dto);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => await _serviceCategoryFlow.DeleteAsync(id) ? NoContent() : NotFound();
}
