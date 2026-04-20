var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5000");

// Add services to the container.
// Configure (disable) Cross-Origin Resource Separation for now
builder.Services.AddCors(o => o.AddPolicy("AllowAll", builder =>
{
    builder.AllowAnyHeader();
    builder.AllowAnyMethod();
    builder.AllowAnyOrigin();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
// Serve files from wwwroot, apply the policy we defined before.
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("AllowAll");

var todos = new List<Todo>();

app.MapGet("/todos", () => todos);

app.MapPost("/todos", (Todo t) =>
{
    todos.Add(t);
    return Results.Created($"/todos/{t.Id}", t);
});

app.MapPut("/todos/{id}", (int id, Todo t) =>
{
    var index = todos.FindIndex(t => t.Id == id);
    if (index == -1) return Results.NotFound();
    todos[index] = t;
    return Results.Ok(todos[index]);
});

app.Run("http://localhost:5000");

record Todo(int Id, string Description, bool Completed);