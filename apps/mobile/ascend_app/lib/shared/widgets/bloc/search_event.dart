abstract class SearchEvent {}

class SearchTextChanged extends SearchEvent {
  final String text;

  SearchTextChanged(this.text);
}