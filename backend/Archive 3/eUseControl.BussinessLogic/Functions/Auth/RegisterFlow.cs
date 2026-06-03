using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core;
using eUseControl.BussinessLogic.Core.Auth;

namespace eUseControl.BussinessLogic.Functions.Auth;

public class RegisterFlow : RegisterActions, IRegisterFlow
{
    public RegisterFlow(UserContext context, JwtService jwtService)
        : base(context, jwtService)
    {
    }
}
