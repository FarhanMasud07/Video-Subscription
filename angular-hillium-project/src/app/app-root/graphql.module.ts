import {NgModule} from '@angular/core';
import {HttpClientModule, HttpHandler, HttpHeaders} from '@angular/common/http';
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {environment} from "../../environments/environment";
import {onError} from "apollo-link-error";
import {AuthService} from "./services/auth-service/auth-service";

@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
})
export class GraphQLModule {

  constructor(
    authenticationService: AuthService,
    apollo: Apollo,
    httpLink: HttpLink,
  ) {
    const uri = `${environment.graphQlEndPoint}/graphql/`;
    const http = httpLink.create({uri: uri});
    const errorLink = onError(({forward, graphQLErrors, networkError, operation}) => {
      if (graphQLErrors) {
        graphQLErrors.map(({message, locations, path, extensions}) => {
            const code: any = extensions;
            if (code && code.code && code.code === 'AUTH_NOT_AUTHENTICATED') {
              authenticationService.refreshToken().subscribe(() => {
                return forward(operation).subscribe((response: any) => {
                  return response;
                });
              });
            }else{
              // in future
            }
          }
        );
      }
    });
    apollo.create({
      link: errorLink.concat(this.middleware().concat(http)),
      cache: new InMemoryCache()
    });
  }

  private middleware() {
    return new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('JWT_TOKEN')
        }
      });
      return forward(operation);
    });
  }
}
